// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
var hsave = localStorage.getItem('hsave');
var hsaveObject = JSON.parse(hsave);
var hashMap = hsaveObject || [{
  logo: 'D',
  url: 'https://developer.mozilla.org/zh-CN/'
}, {
  logo: 'G',
  url: 'https://www.google.com/'
}];

var simplifyUrl = function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); //正则表达式 删除 / 开头的内容
};

var render = function render() {
  if (hashMap[1] !== undefined) {
    for (var i = 0; i < hashMap.length - 1; i++) {
      for (var j = i + 1; j < hashMap.length; j++) {
        if (hashMap[i].url === hashMap[j].url) {
          alert('请勿添加相同标签！');
          hashMap.splice(j, 1);
          render();
        }
      }
    }
  }
  $siteList.find('li:not(.last)').remove();
  hashMap.forEach(function (node, index) {
    var $li = $('<li>\n    <div class="site" ondragstart="dragStart(event)" draggable="true" ondrop="drop(event)" ondragover="allowDrop(event)">\n      <div class="logo">' + node.logo + '</div>\n      <div class="link">' + simplifyUrl(node.url) + '</div>\n      <div class="close">\n        <svg class="icon" aria-hidden="true">\n          <use xlink:href="#icon-guanbi"></use>\n        </svg>\n      </div>\n    </div>\n  </li>').insertBefore($lastLi);
    $li.on('click', function () {
      window.open(node.url);
    });
    $li.on('click', '.close', function (e) {
      e.stopPropagation();
      hashMap.splice(index, 1);
      render();
    });
  });
};
render();

var ecname = void 0;
var es = {};
var ed = {};
var dragStart = function dragStart(event) {
  // console.log(event.target);
  // console.log($(event.path[0]).find('.link')[0].innerHTML);
  ecname = event.path[0].className;
  var x = $(event.path[0]).find('.link')[0].innerHTML;
  for (var i = 0; i < hashMap.length; i++) {
    // console.log(x,simplifyUrl(hashMap[i].url));
    if (simplifyUrl(hashMap[i].url) === x) {
      es.url = hashMap[i].url;
      es.id = i;
      // console.log(es);
    }
  }
};
var allowDrop = function allowDrop(event) {
  event.preventDefault();
};
var drop = function drop(event) {
  event.preventDefault();
  // console.log(es);
  var temp = {};
  var e = void 0;
  if (event.path[0].className === ecname) {
    e = event.path[0];
  } else {
    e = event.path[1];
  }
  var x = $(e).find('.link')[0].innerHTML;
  // console.log(x);
  for (var i = 0; i < hashMap.length; i++) {
    // console.log(x,simplifyUrl(hashMap[i].url));
    if (simplifyUrl(hashMap[i].url) === x) {
      ed.url = hashMap[i].url;
      ed.id = i;
    }
  }

  temp.logo = hashMap[ed.id].logo;
  temp.url = hashMap[ed.id].url;
  hashMap[ed.id].logo = hashMap[es.id].logo;
  hashMap[ed.id].url = hashMap[es.id].url;
  hashMap[es.id].logo = temp.logo;
  hashMap[es.id].url = temp.url;
  // console.log(hashMap);
  render();
};

$('.addButton').on('click', function () {
  var url = window.prompt('请问你要添加的网址是什么？');
  // console.log(url);
  if (url.indexOf('http') !== 0) {
    url = 'https://' + url;
  }
  // console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  });
  render();
});

window.onbeforeunload = function () {
  var string = JSON.stringify(hashMap);
  localStorage.setItem('hsave', string);
};

$(document).on('keypress', function (e) {
  var key = e.key;

  if ($('#txt').val() === '') {
    for (var i = 0; i < hashMap.length; i++) {
      if (hashMap[i].logo === key) {
        window.open(hashMap[i].url);
      }
    }
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.164ffbbd.map