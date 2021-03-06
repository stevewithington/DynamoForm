/**
 *  DynamoForm-formset.js - A jquery based dynamic formset generator.
 *
 *  Author:     David Cramblett (dcramble@mesd.k12.or.us)
 *  License:    MIT
 */


$(document).ready(function() {

    /**
     * Add formset row activity
     *
     * Add new formset row when add button is clicked. A new row will be created
     * and all rows will be numerically re-indexed to ensure unique name and
     * id attribute when formset is processed server side.
     *
     */
    $('.dynamo-formset').on('click', '.dynamo-formset-row-add', function() {

        // Find the parent dynamo-formset
        var dynamoForm = $(this).closest('.dynamo-formset');

        // Determine if Max Rows is specified
        var maxRows = dynamoForm.attr('data-max-rows');
        if (undefined !== maxRows) {
            // Determine if Max Rows is exceeded and return false now if
            // yes. The add row button should be disabled if max rows has
            // been reached. This check is in here as a precaution.
            if (dynamoForm.find('.dynamo-formset-row').size() >= maxRows) {
                return false;
            }
        }

        // Find last row
        var lastRow = dynamoForm.find('.dynamo-formset-row').last();

        // Determine if dynamo-selectize is in use and disable for cloning
        // purposes.
        var selectizeElements = {};
        lastRow.find('select').each(function() {
            if ($(this)[0].selectize) {
                // Store current seletize options and values to restore later.
                selectizeElements[$(this).attr('id')] = {
                    inputOptions: $(this)[0].selectize.getOptions(),
                    inputValue:   $(this)[0].selectize.getValue()
                }
                $(this)[0].selectize.destroy();
            }
        });

        // Determine if dynamo-datetimepicker is in use and disable for
        // cloning purposes.
        lastRow.find('.dynamo-datepicker').each(function() {
            $(this).data('DateTimePicker').destroy();
        });

        // Clone last row and insert at end of formset
        var newRow = lastRow.clone().insertAfter(lastRow);

        // Clear any data that was already entered in the copied row
        newRow.find( 'input,select,textarea' ).each(function() {
            $(this).val( '' );
            $(this).attr( 'checked', false );
        });


        //Re-enable any dynamo-selectize fields if needed, adding
        // back any options and selected values to the cloned row
        if (!$.isEmptyObject(selectizeElements)) {
            var copiedFormElements = [];
            var newFormElements    = [];
            $.each(selectizeElements, function(key, value) {
                copiedFormElements.push(lastRow.find('select#'+key));
                newFormElements.push(newRow.find('select#'+key));
            })

            // Renable Selectize with disabled PreLoad on copied elements
            initDynamoSelectize(copiedFormElements, true);

            // Renable Selectize on new elements
            initDynamoSelectize(newFormElements);

            // Copy back options and values to cloned row
            $.each(selectizeElements, function(key, value) {
                selectizedObject = lastRow.find('select#'+key)[0].selectize;
                $.each(value.inputOptions, function(key, value) {
                    selectizedObject.addOption(value);
                });
                selectizedObject.setValue(value.inputValue, true);
            });
        }

        // Re-enable any dynamo-datetimepicker fields, adding
        // back any options to the cloned row
        lastRow.find('.dynamo-datepicker').each(function() {
            initBootstrapDateTimePicker($(this));
        });
        newRow.find('.dynamo-datepicker').each(function() {
            initBootstrapDateTimePicker($(this));
        });

        // Update the row numbering
        updateRowIndex( dynamoForm );

        // Determine if Max Rows is specified
        if (undefined !== maxRows) {
            // Determine if Max Rows has been met. If yes
            // remove add row button functionality.
            if (dynamoForm.find('.dynamo-formset-row').size() == maxRows) {
                dynamoForm.find('.dynamo-formset-row-add').addClass('disabled');
                dynamoForm.find('.dynamo-formset-row-add').attr('disabled', 'disabled');
            }
        }

        // Determine if Min Rows is specified
        var minRows = dynamoForm.attr('data-min-rows');
        if (undefined !== minRows) {
            // Determine if Min Rows has now been exceeded.
            // If yes, restore delete button functionality.
            if (dynamoForm.find('.dynamo-formset-row').size() > minRows) {
                dynamoForm.find('.dynamo-formset-row-delete').removeClass('disabled');
                dynamoForm.find('.dynamo-formset-row-delete').removeAttr('disabled');
            }
        }

        return false;
    });



     /**
     * Remove formset row activity
     *
     * Remove formset row when delete button is clicked. The specific row will be
     * deleted and all rows will be numerically re-indexed to ensure unique name
     * and id attribute when form is processed server side.
     *
     */
    $('.dynamo-formset').on('click', '.dynamo-formset-row-delete', function() {

        // Find the parent dynamo-formset
        var dynamoForm = $(this).closest('.dynamo-formset');

        // Determine if Min Rows is specified
        var minRows = dynamoForm.attr('data-min-rows');
        if (undefined !== minRows) {
            // Determine if Min Rows is met and return false now if
            // yes. The delete row buttons should be disabled if min rows
            // has been reached. This check is in here as a precaution.
            if (dynamoForm.find('.dynamo-formset-row').size() <= minRows) {
                return false;
            }
        }

        // Remove row
        $( this ).closest('.dynamo-formset-row').remove();

        // Update the row numbering
        updateRowIndex( dynamoForm );

        // Determine if Min Rows is specified
        if (undefined !== minRows) {
            // Determine if Min Rows has been met. If yes
            // remove delete row button functionality.
            if (dynamoForm.find('.dynamo-formset-row').size() == minRows) {
                dynamoForm.find('.dynamo-formset-row-delete').addClass('disabled');
                dynamoForm.find('.dynamo-formset-row-delete').attr('disabled', 'disabled');
            }
        }

        // Determine if Max Rows is specified
        var maxRows = dynamoForm.attr('data-max-rows');
        if (undefined !== maxRows) {
            // Determine if Max Rows has now been maintained.
            // If yes, restore add row button functionality.
            if (dynamoForm.find('.dynamo-formset-row').size() < maxRows) {
                dynamoForm.find('.dynamo-formset-row-add').removeClass('disabled');
                dynamoForm.find('.dynamo-formset-row-add').removeAttr('disabled');
            }
        }

        return false;
    });

});


/**
 * Re-index formset rows
 *
 * Row indexing is updated after a formset row has been added or deleted.
 *
 */
function updateRowIndex(obj) {

    var index = 1;

    obj.find('.dynamo-formset-row').each( function() {

        var dynamoFormRow = $(this);

        dynamoFormRow.find('*').not('option').each( function() {

            // Re-index 'id' attribute
            if ( undefined !== $(this).attr('id') ) {
                $(this).attr('id', reindexIdentityAttribute( $(this).attr('id'), index));
            }

            // Re-index 'name' attribute
            if ( undefined !== $(this).attr('name') ) {
                $(this).attr('name', reindexIdentityAttribute($(this).attr('name'), index));
            }

            // Re-index dynamo-selectize data-chain-child / data-chain-parent
            if ( undefined !== $(this).attr('data-chain-child') ) {
                $(this).attr(
                    'data-chain-child',
                    reindexDynamoSelectizeAttribute(
                        $(this).attr('data-chain-child'),
                        index
                    )
                );
            }
            if ( undefined !== $(this).attr('data-chain-parent') ) {
                $(this).attr(
                    'data-chain-parent',
                    reindexDynamoSelectizeAttribute(
                        $(this).attr('data-chain-parent'),
                        index
                    )
                );
            }

            // Re-index label text if requested
            if ( 'true' == $(this).attr('data-dynamo-relabel') ) {
                $(this).text(reindexText($(this).text(), index));

                // Re-index 'for' attributes on labels
                if ( undefined !== $(this).attr('for') ) {
                    $(this).attr('for', reindexIdentityAttribute($(this).attr('for'), index));
                }
            }

            // Re-index dynamo-selectize url vairables if needed
            if ($(this).hasClass('dynamo-selectize') && undefined !== $(this).attr('data-load-url')) {
                $(this).attr(
                    'data-load-url',
                    reindexUrlVariables(
                        $(this).attr('data-load-url'),
                        index
                    )
                );
            }
        });

        index++;
    });
}


/**
 * Re-index id, name, and for attributes
 *
 * Check attribute for integer index pattern and update the attribute
 * when pattern is matched.
 */
function reindexIdentityAttribute(attribute, index) {
    attribute = attribute.replace(/\_\d+/, '_' + index);
    attribute = attribute.replace(/\d+]$/, index + ']');

    return attribute;
}


/**
 * Re-index element text
 *
 * Check element text for index pattern and update the text when
 * pattern is matched.
 */
function reindexText(text, index) {
    text = text.replace(/\ \d+$/, ' ' + index);

    return text;
}


/**
 * Re-index dynamo-selectize attributes
 *
 * Check attribute for integer index pattern and update the attribute
 * when pattern is matched.
 */
function reindexDynamoSelectizeAttribute(attribute, index) {
    attribute = attribute.replace(/\_\d+\"/g, '_' + index + '"');

    return attribute;
}


/**
 * Re-index dynamo-selectize url variables
 *
 * Check url string for variables with integer index pattern and
 * update the variable when pattern is matched.
 */
function reindexUrlVariables(attribute, index) {
    attribute = attribute.replace(/\{(\w+)\_\d+\}/g, '{' + '$1' + '_' + index + '}');

    return attribute;
}