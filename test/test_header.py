# test_header.py
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = "https://eyrie-contracting-project-3.onrender.com/"

# --- Fixture to setup & teardown driver ---
@pytest.fixture
def driver():
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.maximize_window()
    yield driver
    driver.quit()

# --- Parametrized Test for header links ---
@pytest.mark.parametrize("menu_text, expected_url", [
    ("Home", "index"),
    ("About Us", "about"),
    ("Design-Build", "designbuild"),
    ("Gallery", "gallery"),
])
def test_header_navigation(driver, menu_text, expected_url):
    driver.get(BASE_URL)

    # Locate the link
    element = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, f"//a[normalize-space()='{menu_text}']"))
    )
    element.click()

    # Assert page URL
    WebDriverWait(driver, 10).until(EC.url_contains(expected_url))
    assert expected_url in driver.current_url.lower()

def test_services_dropdown_welding(driver):
    driver.get(BASE_URL)
    wait = WebDriverWait(driver, 10)
    actions = ActionChains(driver)

    # Hover on Services
    services = wait.until(
        EC.presence_of_element_located((By.XPATH, "//button[normalize-space()='Services']"))
    )
    actions.move_to_element(services).perform()

    # Click Welding & Fabrication
    welding = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//a[normalize-space()='Welding & Fabrication']"))
    )
    welding.click()

    # Verify page loaded
    wait.until(EC.url_contains("welding"))
    assert "welding" in driver.current_url.lower()