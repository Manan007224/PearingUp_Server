//
//  SignUpInfoController.swift
//  Pearing_Up
//
//  Created by Manan Maniyar on 2018-06-29.
//  Copyright © 2018 Manan Maniyar. All rights reserved.
//

import UIKit
import Alamofire
import CoreLocation
import SwiftyJSON

class SignUpInfoController: UIViewController {
    
    var usnm = ""
    
    //var signup_info_url : URL = URL(string: "https://pearingup.herokuapp.com/signup")!
    
    @IBOutlet weak var user_name: UITextField!
    @IBOutlet weak var user_address: UITextField!
    @IBOutlet weak var user_city: UITextField!
    let signup_url = "https://pearingup.herokuapp.com/signup"

    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //signup_info_url = "https://pearingup.herokuapp.com/\(usnm)/signup_info"
        //let signup_info_url = NSURL(string: s_url)
    }

    
        @IBAction func signupInfo(_ sender: Any) {
            let info_params : [String:String] = ["full_name": user_name.text!, "location": user_address.text!, "city": user_city.text!]
            let signup_info_url : URL = URL(string: "https://pearingup.herokuapp.com/\(usnm)/signup_info")!
            check_location(addr: user_address.text!)
            print(signup_info_url)
            signup_info(url: signup_info_url, params: info_params)
    }
    
    func signup_info(url: URL, params:[String:String]){
        
        // Pass the request to the server here
        
        Alamofire.request(url, method: .post, parameters: params).responseJSON{
            response in
            if(response.result.isSuccess) {
                let temp : JSON  = JSON(response.result.value!)
                print(temp)
                
                if(temp["code"] == 302 || temp["code"] == 400 || temp["code"] == 409) {
                    self.displayAlert(message: String(describing: temp["result"]))
                }
                
                self.performSegue(withIdentifier: "SingupToLogin", sender: self)
            }
            else {
                print("Error")
                print(response.error ?? "None")
            }
        }
    }
    
    
    func displayAlert(message: String){
        
        let alert_toDisplay = UIAlertController(title: "Alert", message: message, preferredStyle: .alert)
        
        alert_toDisplay.addAction(UIAlertAction(title: "Ok", style: .default, handler: { action in
            self.user_city.text = "city"
            self.user_address.text = "Location"
            self.user_name.text = "Full Name"
        }))
        self.present(alert_toDisplay, animated: true, completion: nil)
    }
    
    
    func check_location(addr: String){
        let geoCoder = CLGeocoder()
        geoCoder.geocodeAddressString(addr, completionHandler: {(plc, err) -> Void in
            if(err != nil) {
                self.displayAlert(message: "Please enter a valid email address")
            }
            if let placemark = plc?.first {
                let coordinates : CLLocationCoordinate2D = placemark.location!.coordinate
                print("Lat: \(coordinates.latitude) -- Long: \(coordinates.longitude)")
                
            }
        })
    }
    
}
