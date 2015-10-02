//
//  TMLocationManager.m
//  Totem
//
//  Created by sam on 10/2/15.
//  Copyright © 2015 totem. All rights reserved.
//

#import "TMLocationManager.h"

@implementation TMLocationManager
{
  NSMutableArray *_locationUpdateCallbacks;

  
}

RCT_EXPORT_MODULE();

- (instancetype)init
{
  if ((self = [super init])) {
     _locationUpdateCallbacks = [NSMutableArray new];
    
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    self.locationManager.distanceFilter = kCLDistanceFilterNone;
    
  }
  return self;
}

RCT_EXPORT_METHOD(listenForLocationUpdates:(NSDictionary *)args callback:(RCTResponseSenderBlock)callback){
  [_locationUpdateCallbacks addObject:callback ?: ^(__unused id unused) {}];
  NSLog(@"recieved a callback for location updates");
  callback(@[[NSNull null], @"Hello from objective c"]);
  
}

#pragma mark - CLLocationManager Delegate methods

// This method is called whenever the application’s ability to use location
// services changes. Changes can occur because the user allowed or denied the
// use of location services for your application or for the system as a whole.
//
// If the authorization status is already known when you call the
// requestWhenInUseAuthorization or requestAlwaysAuthorization method, the
// location manager does not report the current authorization status to this
// method. The location manager only reports changes to the authorization
// status. For example, it calls this method when the status changes from
// kCLAuthorizationStatusNotDetermined to kCLAuthorizationStatusAuthorizedWhenInUse.
-(void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
  NSLog(@"did change authorization status: %@", @(status));
  CLAuthorizationStatus notDetermined = kCLAuthorizationStatusNotDetermined;
  CLAuthorizationStatus denied = kCLAuthorizationStatusDenied;
  if (status != notDetermined && status != denied) {
    [manager startUpdatingLocation];
  } else {
    NSLog(@"Cannot update location because:");
    if (status == notDetermined) {
      NSLog(@"CoreLocation authorization is not determined");
    } else {
      NSLog(@"CoreLocation authorization is not denied");
    }
    [manager requestWhenInUseAuthorization];
  }
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations{
  CLLocation *myLocation = [locations lastObject];
  self.lastLocation = myLocation;
  
  if (!self.firstLocationUpdate) {
    // If the first location update has not yet been recieved, then jump to that
    // location.
    NSLog(@"my location is: %f, %f", myLocation.coordinate.latitude, myLocation.coordinate.longitude);
    self.firstLocationUpdate = YES;
  }
}


@end


