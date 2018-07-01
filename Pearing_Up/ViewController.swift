//
//  ViewController.swift
//  Pearing_Up
///Users/gracekim/Documents/PearingUp/Pearing_Up/ViewController.swift
//  Created by Manan Maniyar 2018-06-16.
//  Copyright © 2018 Manan Maniyar. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

@IBDesignable extension UIButton {
    
    @IBInspectable var borderWidth: CGFloat {
        set {
            layer.borderWidth = newValue
        }
        get {
            return layer.borderWidth
        }
    }
    
    @IBInspectable var cornerRadius: CGFloat {
        set {
            layer.cornerRadius = newValue
        }
        get {
            return layer.cornerRadius
        }
    }
    
    @IBInspectable var borderColor: UIColor? {
        set {
            guard let uiColor = newValue else { return }
            layer.borderColor = uiColor.cgColor
        }
        get {
            guard let color = layer.borderColor else { return nil }
            return UIColor(cgColor: color)
        }
    }
}
class ViewController: UIViewController {
    
//    var gradientLayer: CAGradientLayer!
    
//    func createGradientLayer()
//    {
//        gradientLayer = CAGradientLayer()
//
//        //define colors
//        gradientLayer.colors=[UIColor.white.cgColor, UIColor.lightGray.cgColor]
//        gradientLayer.locations=[0.0,0.6,0.8]
//        gradientLayer.frame=self.view.bounds
//        self.view.layer.addSublayer(gradientLayer)
//
//    }
    
    

    let server_URL = "https://pearingup.herokuapp.com/"
    
    @IBOutlet weak var register_label: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //createGradientLayer()
    }
    
    @IBAction func SignupClick(_ sender: Any) {
        performSegue(withIdentifier: "SignupSegue", sender: self)
        
    }
    
    @IBAction func LoginClick(_ sender: Any) {
        performSegue(withIdentifier: "LoginSegue", sender: self)
    }
    
    
    
}













