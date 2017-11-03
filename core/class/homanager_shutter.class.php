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

class homanager_shutter {
/*     * *************************Attributs****************************** */

	private $eqLogic;

/*     * ***********************Methode static*************************** */

	function __construct($_eqLogic) {
		$this->setEqLogic($_eqLogic);
	}

/*     * *********************Methode d'instance************************* */

	public function openWindow($_zshutter) {
		log::add('homanager', 'debug', '[shutter] Check window of zone');
		if (!isset($_zshutter['window']) || count($_zshutter['window']) == 0) {
			log::add('homanager', 'debug', '[shutter] No window to check');
			return false;
		}
		foreach ($_zshutter['window'] as $window) {
			$cmd = cmd::byId(str_replace('#', '', $window['cmd']));
			if (!is_object($cmd)) {
				continue;
			}
			$value = $cmd->execCmd();
			if (isset($window['invert']) && $window['invert'] == 1) {
				$value = ($value == 1) ? 0 : 1;
			}
			if ($value) {
				log::add('homanager', 'debug', '[shutter] There is open window');
				return true;
			}
		}
		log::add('homanager', 'debug', '[shutter] No open window');
		return false;
	}

	public function do($_zshutter, $_action) {
		log::add('homanager', 'debug', '[shutter] Do ' . $_action);
		if ($_action == 'cmdClose' && $_zshutter['doNotCloseIfWindowOpen'] == 1 && $this->openWindow($_zshutter)) {
			log::add('homanager', 'debug', '[shutter] Window is open so no close shutter');
			return;
		}
		foreach ($_zshutter['shutter'] as $shutter) {
			if (!isset($shutter[$_action])) {
				continue;
			}
			$cmd = cmd::byId(str_replace('#', '', $shutter[$_action]));
			if (!is_object($cmd)) {
				continue;
			}
			if ($cmd->getSubType() == 'slider') {
				if ($_action == 'cmdOpen') {
					$cmd->execCmd(array('slider' => 0));
				} else if ($_action == 'cmdClose') {
					$cmd->execCmd(array('slider' => 100));
				}
			} else {
				$cmd->execCmd();
			}
		}
	}

	public function postSave() {
		$allowCmd = array('open', 'close');
		foreach ($this->getEqLogic()->getCmd() as $cmd) {
			if (!in_array($cmd->getLogicalId(), $allowCmd)) {
				$cmd->remove();
			}
		}
		$cmd = $this->getEqLogic()->getCmd(null, 'open');
		if (!is_object($cmd)) {
			$cmd = new homanagerCmd();
		}
		$cmd->setName(__('Ouvrir', __FILE__));
		$cmd->setEqLogic_id($this->getEqLogic()->getId());
		$cmd->setLogicalId('open');
		$cmd->setType('action');
		$cmd->setSubType('message');
		$cmd->setDisplay('message_disable', 1);
		$cmd->setDisplay('title_placeholder', __('Options', __FILE__));
		$cmd->save();

		$cmd = $this->getEqLogic()->getCmd(null, 'close');
		if (!is_object($cmd)) {
			$cmd = new homanagerCmd();
		}
		$cmd->setName(__('Fermer', __FILE__));
		$cmd->setEqLogic_id($this->getEqLogic()->getId());
		$cmd->setLogicalId('close');
		$cmd->setType('action');
		$cmd->setSubType('message');
		$cmd->setDisplay('message_disable', 1);
		$cmd->setDisplay('title_placeholder', __('Options', __FILE__));
		$cmd->save();
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
		log::add('homanager', 'debug', '[shutter] Cmd call ' . $_options['cmd']->getLogicalId());
		if ($_options['cmd']->getLogicalId() == 'open') {
			foreach ($this->getEqLogic()->getConfiguration('zshutter') as $zshutter) {
				if (isset($zshutter['enable']) && $zshutter['enable'] == 0) {
					continue;
				}
				if (in_array(strtolower($zshutter['name']), $except)) {
					continue;
				}
				$this->do($zshutter, 'cmdOpen');
			}
		} else if ($_options['cmd']->getLogicalId() == 'close') {
			foreach ($this->getEqLogic()->getConfiguration('zshutter') as $zshutter) {
				if (isset($zshutter['enable']) && $zshutter['enable'] == 0) {
					continue;
				}
				if (in_array(strtolower($zshutter['name']), $except)) {
					continue;
				}
				$this->do($zshutter, 'cmdClose');
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