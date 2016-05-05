/*
 * L.Control.Layers is a control to allow users to switch between different layers on the map.
 */

L.Control.CustomLayers = L.Control.extend({
	options : {
		collapsed : true,
		position : 'topright',
		autoZIndex : true
	},

	initialize : function(baseLayers, options) {
		L.setOptions(this, options);

		this._layers = {};
		this._lastZIndex = 0;
		this._handlingClick = false;

		for (var i in baseLayers) {
			this._addLayer(baseLayers[i], i);
		}
	},

	onAdd : function() {
		this._initLayout();

		return this._container;
	},

	addBaseLayer : function(layer, name) {
		this._addLayer(layer, name);
	},

	removeLayer : function(layer) {
		delete this._layers[L.stamp(layer)];
	},

	_initLayout : function() {
		var className = 'leaflet-control-layers', container = this._container = L.DomUtil.create('div', className);

		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(container).disableScrollPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		var link = this._layersLink = L.DomUtil.create('button', className + '-toggle topcoat-button', container);

		if (L.Browser.touch) {
			L.DomEvent.on(link, 'click', L.DomEvent.stop);
		}

		L.DomEvent.on(link, 'click', this._onInputClick, this);
	},

	_addLayer : function(layer, name) {

		var id = L.stamp(layer);

		this._layers[id] = {
			layer : layer,
			name : name
		};

		if (this.options.autoZIndex && layer.setZIndex) {
			this._lastZIndex++;
			layer.setZIndex(this._lastZIndex);
		}
	},

	_onInputClick : function() {

		this._handlingClick = true;

		for (var n in this._layers) {
			layer = this._layers[n].layer;
			hasLayer = this._map.hasLayer(layer);

			if (!hasLayer) {
				this._map.addLayer(layer);
			} else if (hasLayer) {
				this._map.removeLayer(layer);
			}
		}

		this._handlingClick = false;

		this._refocusOnMap();
	}
});

L.control.customlayers = function(baseLayers, options) {
	return new L.Control.CustomLayers(baseLayers, options);
};
