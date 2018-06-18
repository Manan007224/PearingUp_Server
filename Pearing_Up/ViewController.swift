//
//  ViewController.swift
//  Pearing_Up
//
//  Created by Manan Maniyar 2018-06-16.
//  Copyright © 2018 Manan Maniyar. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class ViewController: UIViewController {
    
    let server_URL = "https://pearingup.herokuapp.com/"
    
    @IBOutlet weak var register_label: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    @IBAction func SignupClick(_ sender: Any) {
        performSegue(withIdentifier: "SignupSegue", sender: self)
        
    }
    
    @IBAction func LoginClick(_ sender: Any) {
        performSegue(withIdentifier: "LoginSegue", sender: self)
    }
    
    
    
}













