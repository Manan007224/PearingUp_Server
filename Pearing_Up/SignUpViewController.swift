//
//  SignUpViewController.swift
//  Pearing_Up
//
//  Created by Manan Maniyar on 2018-06-18.
//  Copyright © 2018 Manan Maniyar. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class SignUpViewController: UIViewController {

    let signup_url = "https://pearingup.herokuapp.com/signup"
    @IBOutlet weak var signup_label: UILabel!
    @IBOutlet weak var pwd_holder: UITextField!
    @IBOutlet weak var email_holder: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    
    @IBAction func signup_click(_ sender: Any) {
        let signup_params: [String:String] = ["email": email_holder.text!, "password": pwd_holder.text!]
        signup(url: signup_url, params: signup_params)
    }
    
    func signup(url: String, params: [String:String]){
        Alamofire.request(url, method: .post, parameters: params).responseJSON{
            response in
            if response.result.isSuccess {
                let temp : JSON = JSON(response.result.value!)
                print(temp)
                self.performSegue(withIdentifier: "SignupSucessSegue", sender: self)
            }
            else {
                print("Error Happened")
            }
        }
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}















