from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()  

driver.get("http://localhost:3000/login")  

time.sleep(2)

def test_login():
    email_input = driver.find_element(By.XPATH, "//input[@placeholder='Email']")
    password_input = driver.find_element(By.XPATH, "//input[@placeholder='Mật khẩu']")
    submit_button = driver.find_element(By.XPATH, "//button[text()='Đăng nhập']")

    email_input.send_keys("tuananh@gmail.com")
    password_input.send_keys("123456789")

    submit_button.click()

    time.sleep(2)  
    current_url = driver.current_url
    if current_url == "http://localhost:3000/":
        print("Login successfully")
    else:
        print("Login failed")
    # assert "BỘ SƯU TẬP MỚI NHẤT" in driver.page_source 

test_login()
driver.quit()
