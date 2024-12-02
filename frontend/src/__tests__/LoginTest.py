from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import unittest
import time
import sys
from datetime import datetime
from colorama import init, Fore

# Khởi tạo colorama
init(autoreset=True)

class LoginTest(unittest.TestCase):
    def setUp(self):
        chrome_options = Options()
        chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
        chrome_options.add_argument('--log-level=3')
        chrome_options.add_argument('--silent')
        
        # Tạo driver Chrome
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=chrome_options
        )
        self.driver.maximize_window()
        self.base_url = "http://localhost:3000"
        
    def tearDown(self):
        self.driver.quit()

    def log_result(self, test_name, result, error=None):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        status = "PASS" if result else "FAIL"
        status_color = Fore.GREEN if result else Fore.RED  # Dùng màu xanh cho PASS và màu đỏ cho FAIL
        print(f"[{timestamp}] {test_name}: {status_color}{status}")
        if error:
            print(f"{Fore.YELLOW}Error details: {error}")
        print("-" * 50)

    def test_01_login_page_loads(self):
        try:
            self.driver.get(f"{self.base_url}/login")
            wait = WebDriverWait(self.driver, 10)
            login_form = wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))
            self.assertTrue(login_form.is_displayed())
            self.log_result("Login Page Load Test", True)
        except Exception as e:
            self.log_result("Login Page Load Test", False, str(e))
            raise

    def test_02_login_with_valid_credentials(self):
        try:
            self.driver.get(f"{self.base_url}/login")
            wait = WebDriverWait(self.driver, 10)
            email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']")))
            password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            
            email_input.send_keys("trunggaming65@gmail.com")
            password_input.send_keys("123456789")
            
            login_button = self.driver.find_element(By.CSS_SELECTOR, "button")
            login_button.click()
            
            # Chờ chuyển hướng và kiểm tra nếu vẫn ở trang chính
            wait.until(EC.url_to_be(f"{self.base_url}/"))
            self.assertEqual(self.driver.current_url, f"{self.base_url}/")
            
            self.log_result("Valid Login Test", True)
        except Exception as e:
            self.log_result("Valid Login Test", False, str(e))
            raise

    def test_03_registration_flow(self):
        try:
            self.driver.get(f"{self.base_url}/login")
            wait = WebDriverWait(self.driver, 10)
            
            # Bấm vào link đăng ký
            register_link = wait.until(EC.presence_of_element_located((By.XPATH, "//p[contains(text(), 'Tạo tài khoản')]")))
            register_link.click()
            
            # Nhập thông tin đăng ký
            name_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='text']")))
            phone_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='phone']")
            email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
            password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            
            name_input.send_keys("Test User")
            phone_input.send_keys("1234567890")
            email_input.send_keys("newuser@example.com")
            password_input.send_keys("newpassword123")
            
            # Bấm nút đăng ký
            register_button = self.driver.find_element(By.CSS_SELECTOR, "button")
            register_button.click()
            
            # Chờ chuyển hướng và kiểm tra nếu vẫn ở trang chính
            wait.until(EC.url_to_be(f"{self.base_url}/"))
            self.assertEqual(self.driver.current_url, f"{self.base_url}/")
            
            self.log_result("Registration Flow Test", True)
        except Exception as e:
            self.log_result("Registration Flow Test", False, str(e))
            raise

    def test_04_invalid_login(self):
        try:
            self.driver.get(f"{self.base_url}/login")
            wait = WebDriverWait(self.driver, 10)
            
            # Nhập email và password không hợp lệ
            email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']")))
            password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            
            email_input.send_keys("invalid@example.com")
            password_input.send_keys("wrongpassword")
            
            # Bấm nút đăng nhập
            login_button = self.driver.find_element(By.CSS_SELECTOR, "button")
            login_button.click()
            
            # Chờ 2 giây để tránh trường hợp bị chặn do quá nhanh
            time.sleep(2)
            
            # Kiểm tra nếu vẫn ở trang login
            self.assertTrue("/login" in self.driver.current_url)
            
            self.log_result("Invalid Login Test", True)
        except Exception as e:
            self.log_result("Invalid Login Test", False, str(e))
            raise

if __name__ == "__main__":
    # Tạo test suite
    suite = unittest.TestLoader().loadTestsFromTestCase(LoginTest)
    
    # Chạy test suite
    print("\n=== Starting Login Page Tests ===\n")
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    print("\n=== Test Summary ===")
    print(f"Tests Run: {result.testsRun}")
    print(f"Tests Passed: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Tests Failed: {len(result.failures)}")
    print(f"Tests Errored: {len(result.errors)}")
    
    sys.exit(not result.wasSuccessful())
