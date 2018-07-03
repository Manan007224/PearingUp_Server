//
//  SignUpViewControllerUITest.swift
//  Pearing_UpUITests
//
//  Created by Ali Arshad on 2018-06-30.
//  Copyright © 2018 Manan Maniyar. All rights reserved.
//

import XCTest

class SignUpViewControllerUITest: XCTestCase {
    
    
    
    private let app = XCUIApplication()
    private let username = "ilovetrees78"
    private let username2 = "treesareokay"
    private let email = "ilovetrees78@sfu.ca"
    private let email2 = "treesareokay"
    private let password = "tree3"
    private let wrongPassword = "tree34"
    private let fullName = "Tree Man"
    private let address = "12345 Tree Street"
    private let city = "Tree Town"
        
    override func setUp() {
        super.setUp()
        
        // Put setup code here. This method is called before the invocation of each test method in the class.
        
        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = true
        // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
        XCUIApplication().launch()

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
        
        app.buttons["SIGN UP"].tap()
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
    
    private func getBackspaces(numberOfBackspaces: Int) -> String{
        return String(repeating: "\\b", count: numberOfBackspaces)
    }
    
    func testCorrectSignUp() {
        
        app.textFields["htsang"].tap()
        app.typeText(username)
        app.textFields["htsang@sfu.ca"].tap()
        app.typeText(email)
        app.secureTextFields["Password"].tap()
        app.typeText(password)
        app.secureTextFields["Confirm Password"].tap()
        app.typeText(password)
        app.buttons["NEXT"].tap()

        app.textFields["Herbert Tsang"].tap()
        app.typeText(fullName)
        app.textFields["8888 University Drive"].tap()
        app.typeText(address)
        app.textFields["Burnaby"].tap()
        app.typeText(city)
        app.buttons["REGISTER"].tap()
        
        XCTAssert(app.buttons["LOG IN"].exists)
    }
    
    func testDuplicateSignUp() {
        app.navigationBars["Pearing_Up.SignUpView"].buttons["Back"].tap()
        
        testCorrectSignUp()
        
        app.navigationBars["Pearing_Up.LoginView"].buttons["Back"].tap()
        
        app.buttons["SIGN UP"].tap()
        
        app.textFields["htsang"].tap()
        app.typeText(username)
        app.textFields["htsang@sfu.ca"].tap()
        app.typeText(email)
        app.secureTextFields["Password"].tap()
        app.typeText(password)
        app.secureTextFields["Confirm Password"].tap()
        app.typeText(password)
        app.buttons["NEXT"].tap()
        
        app.alerts["Alert"].buttons["Ok"].tap()
        
        app.textFields["htsang"].tap()
        app.typeText(getBackspaces(numberOfBackspaces: username.count) + username2)
        app.textFields["htsang@sfu.ca"].tap()
        app.typeText(getBackspaces(numberOfBackspaces: email.count) + email2)
        app.secureTextFields["Password"].tap()
        app.typeText(getBackspaces(numberOfBackspaces: password.count) + password)
        app.secureTextFields["Confirm Password"].tap()
        app.typeText(getBackspaces(numberOfBackspaces: password.count) + password)
        app.buttons["NEXT"].tap()
        
        app.textFields["Herbert Tsang"].tap()
        app.typeText(fullName)
        app.textFields["8888 University Drive"].tap()
        app.typeText(address)
        app.textFields["Burnaby"].tap()
        app.typeText(city)
        app.buttons["REGISTER"].tap()

        XCTAssert(app.buttons["LOG IN"].exists)

    }
    
    func testNoUsername() {
        app.textFields["htsang"].tap()
        app.typeText("")
        app.textFields["htsang@sfu.ca"].tap()
        app.typeText(email)
        app.secureTextFields["Password"].tap()
        app.typeText(password)
        app.secureTextFields["Confirm Password"].tap()
        app.typeText(password)
        app.buttons["NEXT"].tap()
        
        app.alerts["Alert"].buttons["Ok"].tap()

        app.textFields["htsang"].tap()
        app.typeText(username)
        app.buttons["NEXT"].tap()
    }
    
    func testInvalidPasswords() {
        app.buttons["SIGN UP"].tap()
        
        app.textFields["htsang"].tap()
        app.typeText(username)
        app.textFields["htsang@sfu.ca"].tap()
        app.typeText(email)
        app.secureTextFields["Password"].tap()
        app.typeText(password)
        app.secureTextFields["Confirm Password"].tap()
        app.typeText(wrongPassword)
        app.buttons["NEXT"].tap()
        
        app.alerts["Alert"].buttons["Ok"].tap()
        
        app.secureTextFields["Confirm Password"].tap()
        app.typeText(getBackspaces(numberOfBackspaces: wrongPassword.count) + password)
    }
}
