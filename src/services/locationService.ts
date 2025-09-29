// Location and Maps Service
import { Loader } from '@googlemaps/js-api-loader';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationInfo {
  coordinates: LocationCoordinates;
  address: string;
  city: string;
  country: string;
}

class LocationService {
  private googleMapsLoader: Loader;
  private map: google.maps.Map | null = null;

  constructor() {
    this.googleMapsLoader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo-key',
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  }

  // Initialize Google Maps
  async initializeMap(elementId: string, center?: LocationCoordinates): Promise<google.maps.Map> {
    try {
      const google = await this.googleMapsLoader.load();
      
      const defaultCenter = center || { lat: 32.0853, lng: 34.7818 }; // Tel Aviv
      
      this.map = new google.maps.Map(document.getElementById(elementId)!, {
        center: defaultCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      return this.map;
    } catch (error) {
      console.error('Error initializing map:', error);
      throw error;
    }
  }

  // Get current location
  async getCurrentLocation(): Promise<LocationInfo> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          try {
            const address = await this.reverseGeocode(coordinates);
            resolve({
              coordinates,
              ...address
            });
          } catch (error) {
            resolve({
              coordinates,
              address: 'כתובת לא זמינה',
              city: '',
              country: 'ישראל'
            });
          }
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Reverse geocoding - get address from coordinates
  async reverseGeocode(coordinates: LocationCoordinates): Promise<{ address: string; city: string; country: string }> {
    try {
      const google = await this.googleMapsLoader.load();
      const geocoder = new google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geocoder.geocode(
          { location: coordinates },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const result = results[0];
              const addressComponents = result.address_components;
              
              let city = '';
              let country = '';
              
              addressComponents?.forEach(component => {
                if (component.types.includes('locality')) {
                  city = component.long_name;
                }
                if (component.types.includes('country')) {
                  country = component.long_name;
                }
              });

              resolve({
                address: result.formatted_address,
                city,
                country
              });
            } else {
              reject(new Error('Geocoding failed'));
            }
          }
        );
      });
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Forward geocoding - get coordinates from address
  async geocodeAddress(address: string): Promise<LocationCoordinates> {
    try {
      const google = await this.googleMapsLoader.load();
      const geocoder = new google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geocoder.geocode(
          { address: address + ', ישראל' },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const location = results[0].geometry.location;
              resolve({
                lat: location.lat(),
                lng: location.lng()
              });
            } else {
              reject(new Error('Address not found'));
            }
          }
        );
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  // Calculate distance between two points
  async calculateDistance(origin: LocationCoordinates, destination: LocationCoordinates): Promise<{ distance: string; duration: string }> {
    try {
      const google = await this.googleMapsLoader.load();
      const service = new google.maps.DistanceMatrixService();

      return new Promise((resolve, reject) => {
        service.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, (response, status) => {
          if (status === 'OK' && response && response.rows[0].elements[0].status === 'OK') {
            const element = response.rows[0].elements[0];
            resolve({
              distance: element.distance.text,
              duration: element.duration.text
            });
          } else {
            reject(new Error('Distance calculation failed'));
          }
        });
      });
    } catch (error) {
      console.error('Distance calculation error:', error);
      throw error;
    }
  }

  // Add marker to map
  async addMarker(coordinates: LocationCoordinates, title?: string, info?: string): Promise<google.maps.Marker> {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    const google = await this.googleMapsLoader.load();
    
    const marker = new google.maps.Marker({
      position: coordinates,
      map: this.map,
      title,
      icon: {
        url: '/icons/marker-icon.png',
        scaledSize: new google.maps.Size(40, 40)
      }
    });

    if (info) {
      const infoWindow = new google.maps.InfoWindow({
        content: info
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
    }

    return marker;
  }

  // Get nearby pickup requests (mock implementation)
  async getNearbyPickupRequests(center: LocationCoordinates, radiusKm: number = 5) {
    // This would typically query your database with geospatial queries
    // For now, return mock data
    return [
      {
        id: '1',
        coordinates: { lat: center.lat + 0.01, lng: center.lng + 0.01 },
        title: 'חבילה מדואר ישראל',
        address: 'רח\' הרצל 45',
        price: 15
      },
      {
        id: '2',
        coordinates: { lat: center.lat - 0.01, lng: center.lng - 0.01 },
        title: 'משלוח אמזון',
        address: 'רח\' בן גוריון 12',
        price: 20
      }
    ];
  }

  // Check if location is within Israel
  isLocationInIsrael(coordinates: LocationCoordinates): boolean {
    // Rough bounding box for Israel
    const israelBounds = {
      north: 33.4,
      south: 29.5,
      east: 35.9,
      west: 34.2
    };

    return (
      coordinates.lat >= israelBounds.south &&
      coordinates.lat <= israelBounds.north &&
      coordinates.lng >= israelBounds.west &&
      coordinates.lng <= israelBounds.east
    );
  }
}

export const locationService = new LocationService();
export default locationService;