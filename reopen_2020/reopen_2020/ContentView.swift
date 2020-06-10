//
//  ContentView.swift
//  reopen_2020
//
//  Created by 徐航 on 2020/6/9.
//  Copyright © 2020 falways. All rights reserved.
//

import SwiftUI
import UIKit

struct ContentView: View  {
    @State var _message = "test"
    let swiftUIView = SwiftUIView()
    var body: some View {
        NavigationView{
            VStack {
                NavigationLink(destination: SwiftUIView()){
                    Text("2")
                }
                Spacer().frame(width: 1, height: 20, alignment: .center)
                Button(action:{
                        if self._message=="test" {
                            self._message = "tset"
                        }else {
                            self._message = "test"
                        }
                    
                    }){
                        Text(_message)
                            .font(.largeTitle)
                            .foregroundColor(.orange)
                    }.padding()
                }
            }
            
    }
}
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

