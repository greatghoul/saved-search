import angular from 'angular';

const URL_PAT = /https?:\/\/www\.google\..*\/search\?.*/;

const app = angular.module('app', []);
app.controller('PopupCtrl', $scope => {
  $scope.search = null;

  $scope.init = function() {
    $scope.activeTab().then(tab => {
      $scope.$apply(() => $scope.search = { url: tab.url, name: $scope.keywords(tab.url) });
    });
  };

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
  };
});