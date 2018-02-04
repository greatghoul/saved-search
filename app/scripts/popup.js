import angular from 'angular';
import _ from 'lodash';
import dropdown from 'angular-ui-bootstrap/src/dropdown/index-nocss';

const URL_PAT = /https?:\/\/www\.google\..*\/search\?.*/;

const app = angular.module('app', [dropdown]);

app.filter('i18n', function () {
  return function (key) {
    console.log(key);
    return chrome.i18n.getMessage(key)
  }
});

app.controller('PopupCtrl', ['$timeout', '$scope', function($timeout, $scope) {
  $scope.search = null;
  $scope.searches = [];
  $scope.mode = null;
  $scope.panelExpand = false;

  $scope.init = function() {
    $scope.loadSearches();

    $scope.activeTab().then(tab => {
      $scope.$apply(() => {
        const keywords = $scope.keywords(tab.url);
        $scope.search = { url: tab.url, name: keywords, keywords: keywords };
        $scope.mode = 'create';
      });
    });
  }

  $scope.loadSearches = function() {
    $scope.searches = JSON.parse(localStorage['searches'] || '[]')
  }

  $scope.saveSearches = function() {
    localStorage['searches'] = JSON.stringify($scope.searches);
  }

  $scope.expandPanel = function() {
    $scope.panelExpand = true;
    $timeout(function() {
      document.querySelector('#panel-new .form-control').select();
    }, 100);
  }

  $scope.keywords = function(url) {
    const searchParams = new URLSearchParams(url.split('?').pop());
    return searchParams.get('q');
  }

  $scope.activeTab = function() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true }, tabs => {
        if (tabs && tabs.length > 0 && URL_PAT.test(tabs[0].url)) {
          resolve(tabs[0]);
        }
      });
    });
  }

  $scope.clearSearch = function() {
    $scope.search = null;
    $scope.mode = null;
    $scope.panelExpand = false;
  }

  $scope.editSearch = function(index) {
    $scope.search = { name: $scope.searches[index].name, index: index };
    $scope.mode = 'update';
    $scope.panelExpand = true;
  }

  $scope.saveSearch = function() {
    $scope.searches[$scope.search.index].name = $scope.search.name;
    $scope.saveSearches();
    $scope.clearSearch();
  }

  $scope.removeSearch = function() {
    $scope.searches.splice($scope.search.index, 1);
    $scope.saveSearches();
    $scope.clearSearch();
  }

  $scope.createSearch = function() {
    $scope.searches.push($scope.search);
    $scope.saveSearches();
    $scope.clearSearch();
  }

  $scope.replaceSearch = function(savedSearch) {
    savedSearch.keywords = $scope.search.keywords;
    savedSearch.url = $scope.search.url;
    $scope.saveSearches();
    $scope.clearSearch();
  }
}]);