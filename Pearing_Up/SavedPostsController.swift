//
//  SavedPostsController.swift
//  Pearing_Up
//
//  Created by Manan Maniyar on 2018-06-30.
//  Copyright © 2018 Manan Maniyar. All rights reserved.
//

import UIKit

class SavedPostsController: UIViewController, UICollectionViewDataSource, UICollectionViewDelegate {
    
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
        
        let saved_posts = collectionView.dequeueReusableCell(withReuseIdentifier: "saved_posts_cell", for: indexPath) as! UICollectionViewCell
        
        saved_posts.
        
        return saved_posts
        
    }
    

    
}
