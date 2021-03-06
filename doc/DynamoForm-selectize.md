## DynamoForm-selectize.js

Enable the use of Brian Reavis's popular selectize.js library using html
attributes, without writing any javascript.

**Status:** Beta (March 11, 2015)

**To Do:**
* Add custom rendering support for items from a data attribute.

### Configuration and Usage

There are three simple steps to get started:

* Step 1 - Enable selectize.js
* Step 2 - Enable DynamoForm-selectize.js
* Step 3 - Add dynamo-selectize class to your form element
* Step 4 - Add attributes to your form element

#### Step 1: Enable selectize.js

Add the selectize.js library to your project. For more details see the
[selectize.js](http://brianreavis.github.io/selectize.js/) project page.

#### Step 2: Enable DynamoForm-selectize.js

Download and add the DynamoForm-selectize.js library to your project.

``` html
<script src="js/DynamoForm-selectize.js"></script>
```

#### Step 3: Add dynamo-selectize class to your form element

Add the class `dynamo-selectize` to your form element to enable selectize and
support for reading attribute values to control selectize behavior.

``` html
<select class="dynamo-selectize"></select>
```

#### Step 4: Add attributes to your html to customize

Below is a list of attributes you can add to your form elements to enable
selectize.js functionality. Most of these attributes match the accompanying
selectize option of the same name. The values shown below are the defaults.
Please see the [selectize.js](http://brianreavis.github.io/selectize.js/)
project page for more details about these options.

```html
<select class="dynamo-selectize"
    data-diacritics="false"
    data-create="true"
    data-createOnBlur="false"
    data-createFilter=""
    data-highlight="true"
    data-persist="true"
    data-openOnFocus="true"
    data-maxOptions="1000"
    data-maxItems="1"
    data-hideSelected="false"
    data-allowEmptyOption="false"
    data-scrollDuration="60"
    data-loadThrottle="300"
    data-preload="false"
    data-dropdownParent="null"
    data-dropdownOffsetWidth="null"   <-- only custom selectize
    data-addPrecedence="false"
    data-selectOnTab="false"
    data-options='[]'
    data-dataAttr="data-data"
    data-valueField="value"
    data-optgroupValueField="value"
    data-labelField="text"
    data-optgroupLabelField="label"
    data-optgroupField="optgroup"
    data-sortField="$order"
    data-searchField='["text"]'
    data-searchConjunction="and"
    data-optgroupOrder="[]"
    data-copyClassesToDropdown="true"
>
</select>
```

### Examples

#### Loading data from an array

Selectize can load data from an array if convenient for your application or
environment. The javascript JSON.parse() method is used to convert this data.
JSON.parse() expects the string data to be in proper form to be successfully
parsed. It's important that all strings, including the object key names, be
surrounded in double quotes. This means you will likely need to surround the
html attribute value in single quotes. See example below:

``` html
<select class="dynamo-selectize"
    data-options='[
        {
          "value": 1,
          "text": "Astoria"
        },
        {
          "value": 2,
          "text": "Beaverton"
        },
        {
          "value": 3,
          "text": "Clackamas"
        },
        {
          "value": 4,
          "text": "Dallas"
        },
        {
          "value": 5,
          "text": "The Dalles"
        },
        {
          "value": 6,
          "text": "Hillsboro"
        },
        {
          "value": 7,
          "text": "Junction City"
        }
    ]'
>
</select>
```

#### Loading data from a remote source

Selectize.js has a `load` option to specify a function for loading remote
data. To trigger the load option to be built by dynamo-selectize you must specify
at least the`data-load-type` attribute. There are 4 attributes you can use to
customize the remote fetch:

* data-load-type : The http method to use for the fetch. GET | POST

* data-load-url : The URL to fetch data from. The users search text will be
appended to the URL.

* data-load-resultSet-limit: The max number of records from remote fetch.
Default: 10

* data-load-resultSet-key: The object key under which your data can be found.
Default: null

      If your remote source returns multiple types of data, for instance
      a list of beverages and a list of food items, and you only want the
      beverage list you would specify the key name for the beverage list.

```json
/* JSON Data */
{
  "beverage": [
     {
       "value": 1,
      "text": "Coffee"
     },
     {
       "value": 2,
       "text": "Soda"
     },
     {
      "value": 3,
      "text": "Water"
     }
  ],
  "food": [
     {
       "value": 1,
       "text": "Apple"
     },
     {
       "value": 2,
       "text": "Carrot"
     },
     {
      "value": 3,
      "text": "Sandwich"
     }
  ]
}
```


``` html
<select class="dynamo-selectize"
    data-load-url="data.php?dataType=beverage&search="
    data-load-type="GET"
    data-load-resultSet-key="beverage"
    data-load-resultSet-limit="10"
    data-valueField="value"
    data-labelField="text"
    data-searchField='["text"]'
>
</select>
```

**Note:**

> By default the load option is not called until the user enters a search query
> in the selectize'd input. If you would like to `preload` data when the
> selectize'd input is initialized, use the `data-preload` attribute.


#### Loading data from a custom function

You can also load data via a callback, or custom function you have written to
return data in a JSON format. This is helpful if you want to load data with a
custom transport method that can not be handled easily via simple GET or POST.

* data-load-type : Set to `callback`

* data-load-callback : The custom function you want to call to load your data.

* data-load-resultSet-limit: The max number of records from remote fetch.
Default: 10

* data-load-resultSet-key: The object key under which your data can be found.
Default: null

* data-load-callback-data: Any custom data you want to make available to your custom function.
Default: {}


``` html
<select id="state" class="form-control dynamo-selectize"
  data-preload="true"
  data-load-type="callback"
  data-load-callback="loadStates"
  data-load-callback-data='{"searchDate": "05/05/2015"}'
  data-load-resultSet-key="states"
  data-load-resultSet-limit="10"
  data-valueField="abbr"
  data-labelField="description"
  data-searchField='["abbr","description"]'
>
</select>


<script>

  // Create a new object called "dynamoCallbacks" to hold your custom
  // data load functions.
  var dynamoCallbacks = {

    // These properties are set automatically by DynamoForm-Selectize, using
    // values from the html data attributes on your element. The values
    // specified below are the default values.
    loadData:   {},
    loadKey:    null,
    loadLimit:  10,

    // Now Specify one or more custom data anonymous functions. The function(s)
    // must have two arguments:
    //   query: The value the user typed into the ajax selector
    //   selectizeCallback: The callback function that will return the data
    loadStates: function (query, selectizeCallback) {

      // These are not required to be locally scoped, but doing so can help
      // prevent issues in functions you may create below, where "this" may be
      // pointed at a different scope.
      loadLimit = this.loadLimit;
      loadKey   = this.loadKey;
      loadData  = this.loadData;

      // You can access any custom data passed in from the
      // "data-load-callback-data" attribute via the "loadData" object.
      searchDate = typeof loadData.searchDate !== 'undefined' ? loadData.searchDate : null;

      // Optionally, prevent search from running if searchTerm string is empty,
      // unless data-preload is enabled.
      if (!loadData.requestPreload && !searchTerm.length) {
          return {};
      }

      // Get your custom data here
      var data = {
        "states": [
          {
            "id": 1,
            "abbr": "AK",
            "description": "Alaska"
          },
          {
              "id": 2,
              "abbr": "CA",
              "description": "California"
          },
          {
              "id": 3,
              "abbr": "OR",
              "description": "Oregon"
          },
          {
              "id": 4,
              "abbr": "WA",
              "description": "Washington"
          }
        ]
      };

      // Return your custom data, or a sub-set of it, using the
      // data-load-resultSet-key and data-load-resultSet-limit attributes
      // specified on your element.
      if (null !== loadKey) {
        selectizeCallback(data[loadKey].slice(0, loadLimit));
      }
      else {
        selectizeCallback(data.slice(0, loadLimit));
      }

    }

    // Add more custom functions as needed
  }
</script>
```

#### Working with dependencies - Chaining elements

You can chain form elements together to satisfy dependencies. For instance, if
you had city select list that needs the user to select the state first, you can
chain the state and city elements. Child elements, whose parent elements don't
have a value set, will be disabled until all parents have a value set. The
parent value can also be read by the child element to lookup data if needed.

**Step 1**: Add a `data-chain-child` attribute to the parent(s), with a value of
the child's `id` attribute. `data-chain-child` is a JSON array element. You can
specify more than one child if needed.

**Step 2**: Add a `data-chain-parent` attribute to the child, with a value of the
parent's `id` attribute. `data-chain-parent` is a JSON array element. You can
specify more than one parent if needed.

**Optional**: If the child element needs the parents value to lookup data
you can use variables in the `data-load-url` attribute. Place the parent
element's id attribute between braces `{parent-id}`, e.g. `{state}`, within
the url specification where you want the value to appear when the fetch occurs.


``` html
<select id="state" class="dynamo-selectize"
    data-chain-child='["city"]'
    data-load-type="GET"
    data-load-url="data.php/states/"
    data-load-resultSet-limit="10"
    data-valueField="value"
    data-labelField="text"
    data-searchField='["text"]'
>

<select id="city" class="dynamo-selectize"
    data-chain-parent='["state"]'
    data-load-type="GET"
    data-load-url="data.php/{state}/cities/"
    data-load-resultSet-limit="10"
    data-valueField="value"
    data-labelField="text"
    data-searchField='["text"]'
>
</select>
```

**Parent values the should render children disabled**:

If you have a case where even if the parent control has been activated, but
certain parent values should prevent the child from becoming or staying active,
use the `data-chain-parent-deactivate` attribute. The attribute is a JSON
object element. You can specify more than one parent if needed. You should also
specify an array of values that should prevent the child from becoming active.
Since html values are passed as strings, make sure to include quotes around
your values, even if they are simple integers.

The below example specifies that the `city` selector should not become enabled
when the state selector has not been set, or when the state has been set to
items with a value of 2 or 5.

``` html
<select id="city" class="dynamo-selectize"
    data-chain-parent='["state"]'
    data-chain-parent-deactivate='{ "state": [ "2", "5" ] }'
    data-load-type="GET"
    data-load-url="data.php/{state}/cities/"
    data-load-resultSet-limit="10"
    data-valueField="value"
    data-labelField="text"
    data-searchField='["text"]'
>
</select>
```




#### Custom rendering of options list

Selectize.js has support for custom rendering of options list items. To
activate the rendering add the `data-render-option` attribute to your input
element and set the escaped html you want to rendor as the value of the
attribute. You can use use vairables within the html to represent the data you
want displayed for each option. To create variables in the rendor html, place
the data elements between braces `{data-element}`, e.g. `{name}`,
`{description}`, etc.

For example, here is a list of some json data for states:

```json
{
    "states": [
        {
            "id": 1,
            "abbr": "AK",
            "description": "Alaska"
        },
        {
            "id": 2,
            "abbr": "CA",
            "description": "California"
        },
        {
            "id": 3,
            "abbr": "OR",
            "description": "Oregon"
        },
        {
            "id": 4,
            "abbr": "WA",
            "description": "Washington"
        }
    ]
}
```

I want to display the Abbreviation (abbr) and Description (description) in my
option list. I develop the following html to display my options:

```html
<div><strong>{abbr}</strong> - {description}</div>
```

The varible names between braces `{abbr}` and `{description}` match the
property names from my json data above. Below is the final product:


``` html
<select id="state" class="dynamo-selectize"
    data-render-option='<div><strong>{abbr}</strong> - {description}</div>'
>
```

You may find the html needs to be encoded as html entities to prevent the web
broswer from trying to render the html in the middle of the input element.
The example below uses html entities:


``` html
<select id="state" class="dynamo-selectize"
    data-render-option='&#x3C;div&#x3E;&#x3C;strong&#x3E;{abbr}&#x3C;/strong&#x3E; - {description}&#x3C;/div&#x3E;'
>
```

**Note:**

> Many html templateing systems have support for automatically outputting the
> encoded version of the html. However, if your not using a templateing system,
> you can use one of the free on-line html encoders which allow you to paste in
> your raw html and output the encoded version.
