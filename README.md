# An Approach to Explore Logistic Regression Models
This tool applies the potential of Attribute-RadViz in identifying correlations levels of attributes to explore LR models. We focus on reducing the limitations of using those models in multidimensional data contexts. 

The tool includes the following aspects:
* feature selection,
* regression model construction,
* evaluation of binary and multinomial regression, and 
* construction of a panorama for queries over the model.

## Authors:

  * Erasmo Artur (USP)
  * Rosane Minghim (UCC)

## Installing and running

* Download this project and unzip in a local directory
* Open the HTML file in a browser (tested in Chrome, Firefox, and Edge)

## Getting started

* Rendering the first view:
  * Go to _Left panel->CSV File->Choose_ file to pick a CSV file.
  * Then choose a target attribute from _Left panel->Target Attribute_.
* Generation of logistic regression models:
  * Select attributes clicking over them and click over the dimensional anchor of the desired label.

### The interface

![alt text](https://raw.githubusercontent.com/erasmoartur/lrxptool/master/imgs/screen_interface.png?raw=true)

* _(a)_ File opener
* _(b)_ Target attribute selection
* _(c)_ Define the number of top correlated attributes simultaneously selected when right-clicking over a DA
* _(d)_ Adjust the size of the elements
* _(e)_ Adjust the opacity of the elements
* _(f)_ Adjust the strength of RadViz links
* _(g)_ Adjust the repelling force of the elements (to avoid overlapping)
* _(h)_ Enable/disable visual widgets of the tool (can increase performance)
* _(i)_ Choose the visualization technique for the second view
* _(j)_ Choose an identifier to name the elements in the second view 
* _(k)_ Choose the bound box action in the second view:
  * Show values: Show a table with all values of the selected items
  * Refine: Rebuilds the correlation matrix with only the selected items
* _(l)_ Restart the view
* _(m)_ Enable/disable auto ordering and auto-align
* _(n)_ Define the sample size for the view 
* _(o)_ Define the options to export the current selection
* _(p)_ Define the t-SNE parameters
* _(q)_ Enable/disable the bars in the second view
* _(r)_ Show the silhouette values for:
  * Original data
  * Selected data
  * Selected and projected (RadViz) data
* _(u)_ Search attributes by name
* _(s)_ Refresh the second view
* _(t)_ Search items by name
