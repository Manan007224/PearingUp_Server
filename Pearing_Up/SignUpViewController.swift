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
    @IBOutlet weak var username_holder: UITextField!
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    
    @IBAction func signup_click(_ sender: Any) {
        
        if(email_holder.text == "" || pwd_holder.text == ""){
            print("All fields required")
            displayAlert(message: "Email or Password is Empty. Please fill in again")
            return
        }
        
        if(valid_email(emailString: email_holder.text!)){
            let signup_params: [String:String] = ["username": username_holder.text!, "email": email_holder.text!, "password": pwd_holder.text!]
            signup(url: signup_url, params: signup_params)
        }
        
        else{
            print("There is some error")
            displayAlert(message: "EmailId or Password is invalid. Please fill in again")
            return
        }
    }
    
    func signup(url: String, params: [String:String]){
        Alamofire.request(url, method: .post, parameters: params).responseJSON{
            response in
            if response.result.isSuccess {
                let temp : JSON = JSON(response.result.value!)
                print(temp)
                // This is the case where User Already Exists
                
                if(temp["code"] == 302 || temp["code"] == 400 || temp["code"] == 409){
                    self.displayAlert(message: String(describing: temp["result"]))
                    return
                }
                
                self.performSegue(withIdentifier: "SignupSucessSegue", sender: self)
            }
            else {
                print("Error Happened")
            }
        }
    }
    
    
    func valid_email(emailString: String) -> Bool {
        
        let email_regex = "[A-Z0-9a-z.-_]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,3}"
        
        do {
            let regex = try NSRegularExpression(pattern: email_regex)
            let rnstring = emailString as NSString
            let results = regex.matches(in: emailString, range: NSRange(location: 0, length: rnstring.length))
            
            if results.count == 0 {
                return false
            }
        } catch let error as NSError {
            print("invalid regex: \(error.localizedDescription)")
            return false
        }
        
        return true
    }
    
    func displayAlert(message: String){
        
        let alert_toDisplay = UIAlertController(title: "Alert", message: message, preferredStyle: .alert)
        
        alert_toDisplay.addAction(UIAlertAction(title: "Ok", style: .default, handler: { action in
            self.email_holder.text = "email"
            self.pwd_holder.text = "password"
        }))
        self.present(alert_toDisplay, animated: true, completion: nil)
    }
    
}
