(function(){
	var root = this;
	var _proxy = function(){
		return new Proxy(this, {
			get(target, p) {
				if (p in target) {
					return target[p];
				} else if (typeof target.__noSuchMethod__ == "function") {
					return function(...args) {
						return target.__noSuchMethod__.call(target, p, args);
					};
				}
			}
		});
	};
	var methodList = [
		'a', 'd', 'e', 'i', 'l', 't', 'w'
	];
	methodList = methodList.concat(methodList.map(function(i){return '-'+i; }));
	var methodsMap = {
		'all': 'a',
		'debug': 'd',
		'errors': 'e',
		'error': 'e',
		'err': 'e',
		'info': 'i',
		'logs': 'l',
		'log': 'l',
		'trace': 't',
		'warnings': 'w',
		'warning': 'w',
		'warn': 'w',
	}
	var validMethods = {
		'd': 'debug',
		'e': 'error',
		'i': 'info',
		'l': 'log',
		't': 'trace',
		'w': 'warn',
	}
	class LevelLogger {
		/**
		 * 
		 * @param {string} levels (accepted case-insensitive (comma|space|tab|pipe|...) separated values: a(ll), e(rror(s)), l(og(s)), w(arn(ing(s))) )
		 * 
		 * @returns full or partial version of (window|global) console object
		 */
		constructor(levels) {
			this.once = typeof root!=='undefined' && root!==null && root.console ? root.console : {};
			return this.options(levels);
		}
		reset(){
			Object.keys(this.once).forEach(key=>{
				this[key] = this.once[key];
			}, {});
			return _proxy.apply(this);
		}
		options(){
			var levels = arguments.length ? Array.from(arguments).reduce(function(prev, arg){ prev = prev.concat(arg); return prev; }, []) : 'a';
			let allowed = (Array.isArray(levels) ? levels.join(',') : levels && levels.toString ? levels.toString() : 'a')
				.toLowerCase()
				.replace(/[\-]+/mg, '-');
			
			Object.keys(methodsMap).forEach(function(method){
				allowed = allowed.replace(new RegExp(method, 'mg'), methodsMap[method]);
			});
			
			allowed = allowed
				.replace(/[^a-z\-]/img,'')
				.split(/([\-]?[a-z]{1})/img)
				.filter(level=>{
					return methodList.indexOf(level)>-1;
				});
			allowed = Array.from(new Set(allowed));

			if (allowed.indexOf('a')<allowed.indexOf('-a')){
				return this.reset();
			} else if (allowed.indexOf('-a')>-1) {
				allowed = [];
			}

			Object.keys(this.once).forEach(consoleMethod=>{
				let idx = Object.values(validMethods).indexOf(consoleMethod);
				let kdx = idx>-1 ? Object.keys(validMethods)[idx] : null;
				if (idx>-1 && (allowed.indexOf(kdx)===-1 || allowed.indexOf('-'+kdx)>allowed.indexOf(kdx))) {
					this[consoleMethod] = ()=>null;
				} else {
					this[consoleMethod] = this.once[consoleMethod];
				}
			}, {});
			return _proxy.apply(this);
		}
		__noSuchMethod__(name, args){
			// do something with name and args;
		}
	};

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = LevelLogger;
		if (require && require.main===module && root) {
			root.LevelLogger = LevelLogger;
		} 
	} else if (typeof define === 'function' && define.amd) {
		define([], function() {
			return LevelLogger;
		});
	} else if (root || window) {
		(root || window).LevelLogger = LevelLogger;
	}
})();