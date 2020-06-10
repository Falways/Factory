//
//  SecondViewController.swift
//  reopen_2020
//
//  Created by 徐航 on 2020/6/9.
//  Copyright © 2020 falways. All rights reserved.
//

import UIKit

class SecondViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.red
       
        let button = UIButton(type: .custom)
        button.frame = CGRect(x: 0, y: 200, width: UIScreen.main.bounds.width, height: 50)
        button.backgroundColor = UIColor.white
        button.setTitle("回到RootViewController", for: .normal)
        button.setTitleColor(UIColor.gray, for: .normal)
        view.addSubview(button)
        button.addTarget(self, action: #selector(buttonClick), for: .touchUpInside)
    }

    @objc func buttonClick() {
        navigationController?.popViewController(animated: true)
        // 另一种跳转方式 成对出现
        dismiss(animated: true, completion: nil)
    }
}
