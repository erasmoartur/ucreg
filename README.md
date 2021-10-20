# User-centered Regression
## An Approach to Explore Logistic Regression Models
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

![Screen of the interface](https://raw.githubusercontent.com/erasmoartur/lrxptool/master/imgs/screen_interface.png)

* _(a)_ File opener
* _(b)_ Target attribute selection
* _(c)_ Adjust the size of the elements
* _(d)_ Adjust the opacity of the elements
* _(e)_ Adjust the strength of RadViz links
* _(f)_ Adjust the repelling force of the elements (to avoid overlapping)
* _(g)_ Enable/disable visual widgets of the tool (can increase performance)
  * Information bars: Hide/Show all informations bars
  * Borders of nodes: Hide/Show the borders of the mapped elements
  * Links lines: Hide/Show between DAs and mapped elements
  * Word cloud:  Hide/Show a word cloud when hovering DAs
  * Correlation between attributes: Dynamically changes sizes of elements according to the correlation to the hovered one.
* _(h)_ Choose the evaluation mode in the second view
* _(i)_ Plot some attribute of the data set directly to the ROC
* _(j)_ Choose the discretization of the ROC curve
* _(k)_ Choose the confindence of the LR model
* _(l)_ Choose the attribute used in to identify mapped items by the tooltip
* _(m)_ Define the sample size for the view 
* _(n)_ Define the opacity of the elements
* _(o)_ Adjust the repelling force of the elements (to avoid overlapping)
