//
//  LoginViewController.swift
//  Pearing_Up
//
//  Created by Manan Maniyar on 2018-06-18.
//  Copyright © 2018 Manan Maniyar. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class LoginViewController: UIViewController {

    @IBOutlet weak var login_tet: UILabel!
    @IBOutlet weak var pwd_holder: UITextField!
    @IBOutlet weak var email_holder: UITextField!
    let login_url = "https://pearingup.herokuapp.com/login"
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func login_click(_ sender: Any) {
        let user_params: [String:String] = ["email": email_holder.text!, "password": pwd_holder.text!]
        login(url: login_url, params: user_params)
    }
    
    func login(url: String, params: [String:String]){
        Alamofire.request(url, method: .post, parameters: params).responseJSON{
            response in
            if response.result.isSuccess {
                let temp : JSON = JSON(response.result.value!)
                print(temp)
                self.performSegue(withIdentifier: "ProfileSegue", sender: self)
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
