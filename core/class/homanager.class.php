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

include_file('core', 'homanager_light', 'class', 'homanager');
include_file('core', 'homanager_shutter', 'class', 'homanager');
include_file('core', 'homanager_spresence', 'class', 'homanager');

class homanager extends eqLogic {
	public static $_motors = array(
		'light' => array('name' => 'Lumière', 'icon' => '<i class="fa fa-lightbulb-o"></i>'),
		'shutter' => array('name' => 'Volet roulant', 'icon' => '<i class="icon jeedom-volet-ouvert"></i>'),
		'spresence' => array('name' => 'Simulation de présence', 'icon' => '<i class="fa fa-users"></i>'),
	);
	/*     * *************************Attributs****************************** */

	/*     * ***********************Methode static*************************** */

	public static function pull($_option) {
		log::add('homanager', 'debug', 'Pull action : ' . print_r($_option, true));
		$homanager = homanager::byId($_option['homanager_id']);
		if (is_object($homanager) && $homanager->getIsEnable() == 1) {
			$homanager->execSubMethodFunction('pull', $_option);
		}
	}

	public static function cron() {
		self::execSubStaticFunction('cron');
	}

	public static function cron5() {
		self::execSubStaticFunction('cron5');
	}

	public static function cron15() {
		self::execSubStaticFunction('cron15');
	}

	public static function cron30() {
		self::execSubStaticFunction('cron30');
	}

	public static function cronHourly() {
		self::execSubStaticFunction('cronHourly');
	}

	public static function cronDayly() {
		self::execSubStaticFunction('cronDayly');
	}

	public static function execSubStaticFunction($_function, $_motor = null) {
		if ($_motor != null) {
			$motors = array($_motor => array());
		} else {
			$motors = self::$_motors;
		}
		foreach ($motors as $motor => $value) {
			$class = 'homanager_' . $motor;
			if (method_exists($class, $_function)) {
				$class::$_function();
			}
		}
	}

	/*     * *********************Méthodes d'instance************************* */

	public function getSubClass() {
		$motor = $this->getConfiguration('motor');
		if (!class_exists('homanager_' . $motor)) {
			return null;
		}
		$class = 'homanager_' . $motor;
		return new $class($this);
	}

	public function execSubMethodFunction($_method, $_arg = null) {
		$sub = $this->getSubClass();
		if (method_exists($sub, $_method)) {
			log::add('homamanager', 'debug', 'Exec : ' . $_method . ' with arg : ' . $_arg);
			if ($_arg == null) {
				return $sub->$_method();
			} else {
				return $sub->$_method($_arg);
			}
		}
	}

	public function preInsert() {
		$this->execSubMethodFunction('preInsert');
	}

	public function postInsert() {
		$this->execSubMethodFunction('postInsert');
	}

	public function preSave() {
		$this->execSubMethodFunction('preSave');
	}

	public function postSave() {
		$this->execSubMethodFunction('postSave');
	}

	public function preUpdate() {
		$this->execSubMethodFunction('preUpdate');
	}

	public function postUpdate() {
		$this->execSubMethodFunction('postUpdate');
	}

	public function preRemove() {
		$this->execSubMethodFunction('preRemove');
	}

	public function postRemove() {
		$this->execSubMethodFunction('postRemove');
	}

	/*     * **********************Getteur Setteur*************************** */
}

class homanagerCmd extends cmd {
	/*     * *************************Attributs****************************** */

	/*     * ***********************Methode static*************************** */

	/*     * *********************Methode d'instance************************* */

	public function execute($_options = array()) {
		$this->getEqLogic()->execSubMethodFunction('execCmd', array('cmd' => $this, 'options' => $_options));
	}

	/*     * **********************Getteur Setteur*************************** */
}
