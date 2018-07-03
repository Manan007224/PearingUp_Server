//
//  SavedPostsViewController.swift
//  Pearing_Up
//
//  Created by Navin Kumar Ravindra on 2018-06-30.
//  Copyright © 2018 Manan Maniyar. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class SavedPostsViewController: UIViewController, UICollectionViewDataSource, UICollectionViewDelegate {
    
    // Add the Logic the get all the saved posts from the server
    
    // https://pearingup.herokuapp.com/:sender_username/saved_posts
    
    let bookmarks_url : URL = URL(string: "https://pearingup.herokuapp.com/manan/savedposts")!
   
    let tArray = ["A", "B", "C", "D", "E"]
    let tImage = [UIImage(named: "tree"), UIImage(named: "tree1"), UIImage(named: "tree2"), UIImage(named: "tree2"), UIImage(named: "tree")]
    let tDescription = ["A", "B", "C", "D", "E"]
    let tFruits = ["Apples", "Bananas", "Kiwi", "Oranges", "Pineapple"]
    let tCity = ["Vancouver", "Burnaby", "Surrey", "Coquitlam", "Richmond"]
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        get_bookmarks(url: bookmarks_url)
        self.collectionView(<#T##collectionView: UICollectionView##UICollectionView#>, cellForItemAt: <#T##IndexPath#>)
    }
    
    
    // Here passing all the Alamofire requests
    
    func get_bookmarks(url: URL) {
        Alamofire.request(url, method: .get).responseJSON {
            response in
            if(response.result.isSuccess) {
                let temp : JSON = JSON(response.result.value!)
                print("Success in the get-saved-posts route")
                //print(response.result.value!)
                if(temp["code"] == 302 || temp["code"] == 400 || temp["code"] == 409){
                    self.displayAlert(message: String(describing: temp["result"]))
                    return
                }
            }
            else {
                print("Error happened")
            }
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return tArray.count
    }
    
    
     func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        let saved_posts = collectionView.dequeueReusableCell(withReuseIdentifier: "saved_posts_cell", for: indexPath) as! CollectionViewCell
        
        saved_posts.postImage.image = tImage[indexPath.row]
        saved_posts.postCity.text = tCity[indexPath.row]
        saved_posts.postFruit.text = tFruits[indexPath.row]
        saved_posts.postDescription.text = tDescription[indexPath.row]
        saved_posts.postTitle.text = tArray[indexPath.row]
        
        
        return saved_posts
    }
    
    func displayAlert(message: String){
        print("Function being called")
        let alert_toDisplay = UIAlertController(title: "Alert", message: message, preferredStyle: .alert)
        alert_toDisplay.addAction(UIAlertAction(title: "Ok", style: .default, handler: { action in
            print("Error")
        }));
        self.present(alert_toDisplay, animated: true, completion: nil)
    }

}













