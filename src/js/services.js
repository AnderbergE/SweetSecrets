/**
 * A service to handle collection functions of users and actions.
 */
app.service('collectionHandler', function () {
	/* Update an existing collection (position -1 will add a user) */
	this.updateCollection = function (collection, updateItems, position) {
		// TODO: Error checking and server check.
		if (position == null || position < 0)
			collection.push(updateItems);
		else {
			for (item in updateItems) {
				collection[position][item] = updateItems[item];
			}
		}
	}
	
	/* Remove something from a collection */
	this.removeCollection = function (collection, position) {
		// TODO: Error checking and server check.
		collection.splice(position, 1);
	}
});