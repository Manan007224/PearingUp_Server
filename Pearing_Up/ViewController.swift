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
    
    

    override func viewDidLoad() {
        super.viewDidLoad()
        getLogin(url: server_URL)
    }
    
    


    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func getLogin(url: String){
        Alamofire.request(url, method: .get).responseJSON {
            response in
            if response.result.isSuccess {
                print("Response Successfull")
                print("Response Response")
            }
            else {
                print("Error in the request")
            }
        }
    }
}

