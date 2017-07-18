import angular from 'angular';
import _ from 'lodash';

const URL_PAT = /https?:\/\/www\.google\..*\/search\?.*/;

const app = angular.module('app', []);
app.controller('PopupCtrl', function($scope) {
  $scope.name = null;
  $scope.search = null;
  $scope.persisted = false;
  $scope.showSaveModal = false;
  $scope.showNameDropdown = false;
  $scope.searches = [];

  $scope.init = function() {
    $scope.loadSavedSearches();

    $scope.activeTab().then(tab => {
      $scope.$apply(() => {
        const keywords = $scope.keywords(tab.url);
        const search = { url: tab.url, name: keywords, keywords: keywords };
        $scope.openSaveModal(search, false);
      });
    });
  }

  $scope.toggleNameDropdown = function(show) {
    $scope.showNameDropdown = show;
  }

  $scope.selectSavedSearch = function(name) {
    $scope.search.name = name;
    $scope.toggleNameDropdown(false);
  }

  $scope.loadSavedSearches = function() {
    for (const name in localStorage) {
      if (/^search_.*$/.test(name)) {
        $scope.searches.push(JSON.parse(localStorage[name]));
      }
    }
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

  $scope.openSaveModal = function(search, persisted) {
    $scope.persisted = persisted;
    $scope.name = search.name;
    $scope.search = search;
    $scope.showSaveModal = true;
  }

  $scope.closeSaveModal = function() {
    $scope.showSaveModal = false;
  }

  $scope.saveSearch = function() {
    if ($scope.persisted) {
      delete localStorage[`search_${$scope.name}`];
      const index = _.findIndex($scope.searches, { name: $scope.name });
      $scope.searches.splice(index, 1);
    }

    localStorage[`search_${$scope.search.name}`] = JSON.stringify($scope.search);
    const search = _.find($scope.searches, { name: $scope.search.name });
    if (search) {
      _.assign(search, $scope.search);
    } else {
      $scope.searches.push($scope.search);
    }

    $scope.closeSaveModal();
  }
});