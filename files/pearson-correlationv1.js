/**
 *  @fileoverview Pearson correlation score algorithm.
 *  @author matt.west@kojilabs.com (Matt West)
 *  @license Copyright 2013 Matt West.
 *  Licensed under MIT (http://opensource.org/licenses/MIT).
 */


/**
 *  Calculate the person correlation score between two items in a dataset.
 *
 *  @param  {object}  prefs The dataset containing data about both items that
 *                    are being compared.
 *  @param  {string}  p1 Item one for comparison.
 *  @param  {string}  p2 Item two for comparison.
 *  @return {float}  The pearson correlation score.
 */
function pearsonCorrelation(prefs, p1, p2) {

    var sx = 0.0;
    var sy = 0.0;
    var sxx = 0.0;
    var syy = 0.0;
    var sxy = 0.0;
	
	// If there is only one level in the array, correlation corficient return 0
	var numbersArray1 = prefs[p1].filter((v, i, a) => a.indexOf(v) === i);
	var numbersArray2 = prefs[p2].filter((v, i, a) => a.indexOf(v) === i);	
	if (numbersArray1.length==1 || numbersArray2.length==1)
		return 0;

    var n = prefs[p1].length;

    for(var i = 0; i < n; ++i) {
      var x = prefs[p1][i];
      var y = prefs[p2][i];

      sx += +x;
      sy += +y;
      sxx += +x * +x;
      syy += +y * +y;
      sxy += +x * +y;
    }

    // covariation
    var cov = sxy / n - sx * sy / n / n;
    // standard error of x
    var sigmax = Math.sqrt(sxx / n -  sx * sx / n / n);
    // standard error of y
    var sigmay = Math.sqrt(syy / n -  sy * sy / n / n);

    // correlation is just a normalized covariation
    return cov / sigmax / sigmay;
}