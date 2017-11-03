<?php

/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../../../core/php/core.inc.php';

class homanager_light {
/*     * *************************Attributs****************************** */

	private $eqLogic;

/*     * ***********************Methode static*************************** */

	function __construct($_eqLogic) {
		$this->setEqLogic($_eqLogic);
	}

/*     * *********************Methode d'instance************************* */

	public function pull($_option) {
		log::add('homanager', 'debug', '[light] Got an event : ' . print_r($_option, true));
		foreach ($this->getEqLogic()->getConfiguration('zlights') as $zlight) {
			if (isset($zlight['enable']) && $zlight['enable'] == 0) {
				continue;
			}
			foreach ($zlight['presence'] as $presence) {
				if ($_option['event_id'] != str_replace('#', '', $presence['cmd'])) {
					continue;
				}
				if (isset($presence['invert']) && $presence['invert'] == 1) {
					$_option['value'] = ($_option['value'] == 1) ? 0 : 1;
				}
				log::add('homanager', 'debug', '[light] Valid event final value : ' . $_option['value']);
				if ($_option['value'] == 1) {
					if ($this->checkLuminosity($zlight)) {
						$this->do($zlight, 'cmdOn');
					}
					break (2);
				} else {
					$this->do($zlight, 'cmdOff');
					break (2);
				}
			}
		}
	}

	public function checkLuminosity($_zlight) {
		log::add('homanager', 'debug', '[light] Check luminosity of zone');
		if (!isset($_zlight['luminosity']) || count($_zlight['luminosity']) == 0) {
			log::add('homanager', 'debug', '[light] No luminosity check so luminosity is ok');
			return true;
		}
		foreach ($_zlight['luminosity'] as $luminosity) {
			if (!isset($luminosity['cmd']) || !isset($luminosity['threshold'])) {
				continue;
			}
			$cmd = cmd::byId(str_replace('#', '', $luminosity['cmd']));
			if (!is_object($cmd)) {
				continue;
			}
			$value = $cmd->execCmd();
			log::add('homanager', 'debug', '[light] Compare luminosity ' . $value . ' > ' . $luminosity['threshold']);
			if ($value > $luminosity['threshold']) {
				log::add('homanager', 'debug', '[light] No need light');
				return false;
			}
		}
		log::add('homanager', 'debug', '[light] Need light');
		return true;
	}

	public function do($_zlight, $_action) {
		log::add('homanager', 'debug', '[light] Do ' . $_action);
		foreach ($_zlight['light'] as $light) {
			if (!isset($light[$_action])) {
				continue;
			}
			$cmd = cmd::byId(str_replace('#', '', $light[$_action]));
			if (!is_object($cmd)) {
				continue;
			}
			$cmd->execCmd();
		}
	}

	public function postSave() {
		$allowCmd = array('on', 'off');
		foreach ($this->getEqLogic()->getCmd() as $cmd) {
			if (!in_array($cmd->getLogicalId(), $allowCmd)) {
				$cmd->remove();
			}
		}

		$cmd = $this->getEqLogic()->getCmd(null, 'on');
		if (!is_object($cmd)) {
			$cmd = new homanagerCmd();
		}
		$cmd->setName(__('On', __FILE__));
		$cmd->setEqLogic_id($this->getEqLogic()->getId());
		$cmd->setLogicalId('on');
		$cmd->setType('action');
		$cmd->setSubType('message');
		$cmd->setDisplay('message_disable', 1);
		$cmd->setDisplay('title_placeholder', __('Options', __FILE__));
		$cmd->save();

		$cmd = $this->getEqLogic()->getCmd(null, 'off');
		if (!is_object($cmd)) {
			$cmd = new homanagerCmd();
		}
		$cmd->setName(__('Off', __FILE__));
		$cmd->setEqLogic_id($this->getEqLogic()->getId());
		$cmd->setLogicalId('off');
		$cmd->setType('action');
		$cmd->setSubType('message');
		$cmd->setDisplay('message_disable', 1);
		$cmd->setDisplay('title_placeholder', __('Options', __FILE__));
		$cmd->save();
		if ($this->getEqLogic()->getIsEnable() == 1) {
			$listener = listener::byClassAndFunction('homanager', 'pull', array('homanager_id' => intval($this->getEqLogic()->getId())));
			if (!is_object($listener)) {
				$listener = new listener();
			}
			$listener->setClass('homanager');
			$listener->setFunction('pull');
			$listener->setOption(array('homanager_id' => intval($this->getEqLogic()->getId())));
			$listener->emptyEvent();
			foreach ($this->getEqLogic()->getConfiguration('zlights') as $zlight) {
				if (isset($zlight['enable']) && $zlight['enable'] == 0) {
					continue;
				}
				foreach ($zlight['presence'] as $presence) {
					$cmd = cmd::byId(str_replace('#', '', $presence['cmd']));
					if (!is_object($cmd)) {
						continue;
					}
					$listener->addEvent($presence['cmd']);
				}
			}
			$listener->save();
		} else {
			$listener = listener::byClassAndFunction('homanager', 'pull', array('homanager_id' => intval($this->getEqLogic()->getId())));
			if (!is_object($listener)) {
				if (is_object($listener)) {
					$listener->remove();
				}
			}
		}
	}

	public function execCmd($_options) {
		$args = arg2array($_options['options']['title']);
		$except = explode(',', $args['except']);
		if (count($except) > 0) {
			foreach ($except as &$value) {
				$value = strtolower($value);
			}
		} else {
			$except = array();
		}
		log::add('homanager', 'debug', '[light] Cmd call ' . $_options['cmd']->getLogicalId());
		if ($_options['cmd']->getLogicalId() == 'on') {
			foreach ($this->getEqLogic()->getConfiguration('zlights') as $zlight) {
				if (isset($zlight['enable']) && $zlight['enable'] == 0) {
					continue;
				}
				if (in_array(strtolower($zlight['name']), $except)) {
					continue;
				}
				$this->do($zlight, 'cmdOn');
			}
		} else if ($_options['cmd']->getLogicalId() == 'off') {
			foreach ($this->getEqLogic()->getConfiguration('zlights') as $zlight) {
				if (isset($zlight['enable']) && $zlight['enable'] == 0) {
					continue;
				}
				if (in_array(strtolower($zlight['name']), $except)) {
					continue;
				}
				$this->do($zlight, 'cmdOff');
			}
		}
	}

/*     * **********************Getteur Setteur*************************** */

	public function getEqLogic() {
		return $this->eqLogic;
	}

	public function setEqLogic($eqLogic) {
		$this->eqLogic = $eqLogic;
		return $this;
	}

}