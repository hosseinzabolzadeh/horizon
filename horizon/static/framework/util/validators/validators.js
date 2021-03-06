(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name horizon.framework.util.validators
   * @description
   *
   * # horizon.framework.util.validators
   *
   * The `horizon.framework.util.validators` module provides support for validating
   * forms.
   *
   * | Directives                                                                      |
   * |---------------------------------------------------------------------------------|
   * | {@link horizon.framework.util.validators.directive:validateNumberMax `validateNumberMax`} |
   * | {@link horizon.framework.util.validators.directive:validateNumberMin `validateNumberMin`} |
   * | {@link horizon.framework.util.validators.directive:hzPasswordMatch `hzPasswordMatch`} |
   *
   */
  angular.module('horizon.framework.util.validators', [])

  /**
   * @ngdoc directive
   * @name horizon.framework.util.validators.directive:validateNumberMax
   * @element ng-model
   * @description
   * The `validateNumberMax` directive provides max validation
   * for the form input elements. This is an alternative to
   * `max` which doesn't re-evaluate expression passed in on
   * change. This allows the max value to be dynamically
   * specified.
   *
   * The model and view value is not set to undefined if
   * input does not pass validation. This is so that
   * components that are watching this value can determine
   * what to do with it. For example, quota charts can
   * still render and display over-utilized slices in red.
   *
   * Validator returns true if model/view value <= max value.
   *
   * @restrict A
   *
   * @example
   * ```
   * <input type="text" ng-model="value"
   *   validate-number-max="{$ maxNumber $}">
   * ```
   */
    .directive('validateNumberMax', [function () {
      return {
        require:  'ngModel',
        restrict: 'A',
        link:     function (scope, element, attrs, ctrl) {
          if (!ctrl) {
            return;
          }

          var maxValidator = function (value) {
            var max = scope.$eval(attrs.validateNumberMax);
            if (angular.isDefined(max) && !ctrl.$isEmpty(value) && value > max) {
              ctrl.$setValidity('validateNumberMax', false);
            } else {
              ctrl.$setValidity('validateNumberMax', true);
            }

            // Return the value rather than undefined if invalid
            return value;
          };

          // Re-validate if value is changed through the UI
          // or model (programmatically)
          ctrl.$parsers.push(maxValidator);
          ctrl.$formatters.push(maxValidator);

          attrs.$observe('validateNumberMax', function () {
            maxValidator(ctrl.$modelValue);
          });
        }
      };
    }])

  /**
   * @ngdoc directive
   * @name horizon.framework.util.validators.directive:validateNumberMin
   * @element ng-model
   * @description
   * The `validateNumberMin` directive provides min validation
   * for form input elements. This is an alternative to `min`
   * which doesn't re-evaluate the expression passed in on
   * change. This allows the min value to be dynamically
   * specified.
   *
   * The model and view value is not set to undefined if
   * input does not pass validation. This is so that
   * components that are watching this value can determine
   * what to do with it. For example, quota charts can
   * still render and display over-utilized slices in red.
   *
   * Validator returns true is model/view value >= min value.
   *
   * @restrict A
   *
   * @example
   * ```
   * <input type="text" ng-model="value"
   *   validate-number-min="{$ minNumber $}">
   * ```
   */
    .directive('validateNumberMin', [function () {
      return {
        require:  'ngModel',
        restrict: 'A',
        link:     function (scope, element, attrs, ctrl) {
          if (!ctrl) {
            return;
          }

          var minValidator = function (value) {
            var min = scope.$eval(attrs.validateNumberMin);
            if (angular.isDefined(min) && !ctrl.$isEmpty(value) && value < min) {
              ctrl.$setValidity('validateNumberMin', false);
            } else {
              ctrl.$setValidity('validateNumberMin', true);
            }

            // Return the value rather than undefined if invalid
            return value;
          };

          // Re-validate if value is changed through the UI
          // or model (programmatically)
          ctrl.$parsers.push(minValidator);
          ctrl.$formatters.push(minValidator);

          attrs.$observe('validateNumberMin', function () {
            minValidator(ctrl.$modelValue);
          });
        }
      };
    }])

    .directive('notBlank', function () {
      return {
        require: 'ngModel',
        link:    function (scope, elm, attrs, ctrl) {
          ctrl.$parsers.unshift(function (viewValue) {
            if (viewValue.length) {
              // it is valid
              ctrl.$setValidity('notBlank', true);
              return viewValue;
            }
            // it is invalid, return undefined (no model update)
            ctrl.$setValidity('notBlank', false);
            return undefined;
          });
        }
      };
    })

    /**
     * @ngdoc directive
     * @name hzPasswordMatch
     * @element ng-model
     *
     * @description
     * A directive to ensure that password matches.
     * Changing the password or confirmation password triggers a validation check.
     * However, only the confirmation password will show an error if match is false.
     * The goal is to check that confirmation password matches the password,
     * not whether the password matches the confirmation password.
     * The behavior here is NOT bi-directional.
     *
     * @restrict A
     *
     * @scope
     * hzPasswordMatch - form model to validate against
     *
     * @example:
     * <form name="form">
     *  <input type='password' id="psw" ng-model="user.psw" name="psw">
     *  <input type='password' ng-model="user.cnf" hz-password-match="form.psw">
     * </form>
     *
     * Note that id and name are required for the password input.
     * This directive uses the form model and id for validation check.
     */
    .directive('hzPasswordMatch', function(){
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: { pw: '=hzPasswordMatch' },
        link: function(scope, element, attr, ctrl){

          // helper function to check that password matches
          function passwordCheck(){
            scope.$apply(function(){
              var match = (ctrl.$modelValue === scope.pw.$modelValue);
              ctrl.$setValidity('match', match);
            });
          }

          // this ensures that typing in either input
          // will trigger the password match
          var pwElement = $('#'+scope.pw.$name);
          pwElement.on('keyup change', passwordCheck);
          element.on('keyup change', passwordCheck);

        } // end of link
      }; // end of return
    }); // end of directive

}());