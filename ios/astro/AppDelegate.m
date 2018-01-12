/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import "RCTSplashScreen.h" //import interface
#import "ShareSDKManager.h" //import interface
#import "UMMobClick/MobClick.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  
#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
    jsCodeLocation = [CodePush bundleURL];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"astro"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  //[RCTSplashScreen open:rootView];
  [RCTSplashScreen open:rootView withImageNamed:@"splash"];
  
  //[ShareSDK init];
  [ShareSDKManager ready];
  
  //[UMENG init]
  UMConfigInstance.appKey = @"598130e82ae85b7433000d82";
  [MobClick startWithConfigure:UMConfigInstance];
  [MobClick setLogEnabled:YES];
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

// https://stackoverflow.com/questions/28465612/how-can-i-set-landscape-orientation-when-playing-a-video-from-webview
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  id presentedViewController = [window.rootViewController presentedViewController];
  NSString *className = presentedViewController ? NSStringFromClass([presentedViewController class]) : nil;
  
  if (window && ([className isEqualToString:@"MPInlineVideoFullscreenViewController"] || [className isEqualToString:@"AVFullScreenViewController"])) {
    return UIInterfaceOrientationMaskAll;
  } else {
    return UIInterfaceOrientationMaskPortrait;
  }
  
}

@end
