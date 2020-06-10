//
//  ShowContentView.swift
//  reopen_2020
//
//  Created by 徐航 on 2020/6/9.
//  Copyright © 2020 falways. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.green
               
               let button = UIButton(type: .custom)
               button.frame = CGRect(x: 0, y: 200, width: UIScreen.main.bounds.width, height: 50)
               button.backgroundColor = UIColor.white
               button.setTitle("打开新的视图控制器", for: .normal)
               button.setTitleColor(UIColor.gray, for: .normal)
               view.addSubview(button)
               button.addTarget(self, action: #selector(buttonClick), for: .touchUpInside)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    @objc func buttonClick() {
        navigationController?.pushViewController(SecondViewController(), animated: true)
        // 另一种跳转方式
        // present(ViewController(), animated: true, completion: nil)
    }
}
