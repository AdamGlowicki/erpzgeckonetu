#!/usr/bin/env python
# coding=utf-8

# need chromium 47 from launchpad

import os
import sys
import time
import commands
import argparse
import mysql.connector

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
from fake_useragent import UserAgent
from pprint import pprint

parser = argparse.ArgumentParser()
parser.add_argument("kodWydzialu", help="kod wydziału")
parser.add_argument("numerKW", help="numer KW")
args = parser.parse_args()

ua = UserAgent()

# os.environ['SOCKS_SERVER'] = "127.0.0.1:" + str(socks_port)
# os.environ['SOCKS_VERSION'] = "5"

kodWydzialu = args.kodWydzialu
numerKWx = "%08d" % (int(args.numerKW),)

print numerKWx

result = commands.getstatusoutput("nodejs /home/www/geckoerp/ekw.js " + kodWydzialu + numerKWx)

cyfraKontrolnaX = result[1]

print cyfraKontrolnaX

userAgent = ua.random
print(userAgent)

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--incognito")
chrome_options.add_argument("--disable-impl-side-painting")
chrome_options.add_argument("--disable-setuid-sandbox")
# chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-seccomp-filter-sandbox")
chrome_options.add_argument("--disable-breakpad")
chrome_options.add_argument("--disable-client-side-phishing-detection")
chrome_options.add_argument("--disable-cast")
chrome_options.add_argument("--disable-cast-streaming-hw-encoding")
chrome_options.add_argument("--disable-cloud-import")
chrome_options.add_argument("--disable-popup-blocking")
chrome_options.add_argument("--ignore-certificate-errors")
chrome_options.add_argument("--disable-session-crashed-bubble")
chrome_options.add_argument("--disable-ipv6")
chrome_options.add_argument("--allow-http-screen-capture")
chrome_options.add_argument("start-maximized")
chrome_options.add_argument('user-agent={userAgent}')
driver = os.path.join("/usr/lib/chromium-browser/", "chromedriver")

browser = webdriver.Chrome(executable_path=driver,chrome_options=chrome_options)
browser.delete_all_cookies()
browser.maximize_window()

browser.get("https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW?komunikaty=true&kontakt=true&okienkoSerwisowe=false")

try:
	WebDriverWait(browser, 10).until(
		EC.presence_of_element_located((By.ID, "kodWydzialu"))
	)
except:
	browser.close()
	browser.quit()

kodWydzialuInput = browser.find_element_by_id("kodWydzialuInput")
kodWydzialuInput.send_keys(kodWydzialu)

numerKsiegiWieczystej = browser.find_element_by_id("numerKsiegiWieczystej")
browser.execute_script("$(arguments[0]).val('" + numerKWx + "');", numerKsiegiWieczystej)
# numerKsiegiWieczystej.send_keys(numerKWx)

cyfraKontrolna = browser.find_element_by_id("cyfraKontrolna")
browser.execute_script("$(arguments[0]).val('" + cyfraKontrolnaX + "');", cyfraKontrolna)
# cyfraKontrolna.send_keys(cyfraKontrolnaX)

time.sleep(1)

wyszukaj = browser.find_element_by_id("wyszukaj")
# browser.execute_script("$(arguments[0]).trigger('click');", wyszukaj)
wyszukaj.click()

try:
	WebDriverWait(browser, 60).until(
		EC.visibility_of_element_located((By.ID, "przyciskWydrukZupelny"))
	)
except:
	browser.close()
	browser.quit()

time.sleep(1)

przyciskWydrukZupelny = browser.find_element_by_id("przyciskWydrukZupelny")
browser.execute_script("$(arguments[0]).trigger('click');", przyciskWydrukZupelny)
# przyciskWydrukZupelny.click()

try:
	WebDriverWait(browser, 60).until(
		EC.presence_of_element_located((By.XPATH, "//input[@value='OKLADKA']"))
	)
except:
	browser.close()
	browser.quit()

time.sleep(1)

okladka = browser.find_elements(By.XPATH, "//input[@type='submit']")
print(okladka)

print(browser.page_source)

browser.close()
browser.quit()
