import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = "https://eyrie-contracting-project-3.onrender.com/contact.html"

@pytest.fixture
def driver():
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.maximize_window()
    yield driver
    driver.quit()

def test_contact_form_submission(driver):
    driver.get(BASE_URL)
    wait = WebDriverWait(driver, 10)

    # Fill dropdowns
    Select(driver.find_elements(By.CLASS_NAME, "contact-select")[0]).select_by_visible_text("Request a Quote")
    Select(driver.find_elements(By.CLASS_NAME, "contact-select")[1]).select_by_visible_text("Residential")

    # Fill text inputs
    inputs = driver.find_elements(By.CLASS_NAME, "contact-input")
    inputs[0].send_keys("John")
    inputs[1].send_keys("Smith")
    inputs[2].send_keys("6041234567")
    inputs[3].send_keys("john@test.com")

    # Fill textarea
    driver.find_element(By.CLASS_NAME, "contact-textarea").send_keys("This is a test project description.")

    # Submit
    driver.find_element(By.ID, "submitBtn").click()

    # Verify success message
    success_msg = wait.until(EC.visibility_of_element_located((By.ID, "formSuccess")))
    assert "successfully" in success_msg.text.lower()