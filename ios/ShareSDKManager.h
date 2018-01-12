//
//  ShareSDKManager.h
//  RNShareSDK
//
//  Created by Kengsir on 16/6/28.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>

@interface ShareSDKManager : RCTEventEmitter <RCTBridgeModule>

+ (void)ready;

@end
