//
//  SavedPostsViewController.swift
//  Pearing_Up
//
//  Created by Navin Kumar Ravindra on 2018-06-30.
//  Copyright © 2018 Manan Maniyar. All rights reserved.
//

import UIKit

class SavedPostsViewController: UIViewController, UICollectionViewDataSource, UICollectionViewDelegate {
    
    // Add the Logic the get all the saved posts from the server
    
    // https://pearingup.herokuapp.com/:sender_username/saved_posts
    
    
   
    let tArray = ["A", "B", "C", "D", "E"]
    let tImage = [UIImage(named: "tree"), UIImage(named: "tree1"), UIImage(named: "tree2"), UIImage(named: "tree2"), UIImage(named: "tree")]
    let tDescription = ["A", "B", "C", "D", "E"]
    let tFruits = ["Apples", "Bananas", "Kiwi", "Oranges", "Pineapple"]
    let tCity = ["Vancouver", "Burnaby", "Surrey", "Coquitlam", "Richmond"]
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
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
    

}
