#!/usr/bin/env python
# coding=utf-8

# chrome 60 + chromedriver 2.31

import os
import random
import sys
import time
import commands
import argparse
import requests
import mysql.connector

from requests.adapters import HTTPAdapter
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.proxy import Proxy, ProxyType
from fake_useragent import UserAgent
from pprint import pprint

mydb = mysql.connector.connect(
    host="localhost",
    user="ekw",
    passwd="rPH5p873rDRgawJx",
    database="geckoerp"
)

mycursor = mydb.cursor()


def exception(b):
    b.close()
    b.quit()

def search(b):
    time.sleep(random.random())

    wyszukaj = b.find_element_by_id("wyszukaj")
    ActionChains(b).move_to_element_with_offset(wyszukaj, random.randint(1, 5), random.randint(1, 5)).perform()

    time.sleep(random.random() + 2)

    ActionChains(b).click(wyszukaj).perform()

    try:
        WebDriverWait(b, random.randint(7,12)).until(
            EC.presence_of_element_located((By.ID, "powrotDoKryterii"))
        )
    except:
        pass
        print "Błąd: nie udało się wczytać strony/CAPTCHA(?)"
        print "Ponawianie wyszukiwania..."
        search(b)



myProxy = "127.0.0.1:9050"

parser = argparse.ArgumentParser()
parser.add_argument("kodWydzialu", help="kod wydziału")
parser.add_argument("numerKW", help="numer KW")
parser.add_argument("cKontrolna", help="cyfra kontrolna")
args = parser.parse_args()

# ua = UserAgent()
# userAgent = ua.random
# print(userAgent)

# os.environ['SOCKS_SERVER'] = "127.0.0.1:" + str(socks_port)
# os.environ['SOCKS_VERSION'] = "5"

path = "storage/app/ekw/"

kodWydzialu = args.kodWydzialu
numerKWx = args.numerKW
cyfraKontrolnaX = args.cKontrolna

print >> sys.stdout, kodWydzialu
print >> sys.stdout, numerKWx
print >> sys.stdout, cyfraKontrolnaX

sql = "SELECT count(1) FROM `ekw` WHERE `sad` = %s AND `numer` = %s"

mycursor.execute(sql, (kodWydzialu, numerKWx))

if mycursor.fetchone()[0]:
    print "Księga już istnieje w bazie danych lub zostala dodana jako nieistniejaca"
    exit()

opt = Options()
opt.add_argument("--incognito")
opt.add_argument("--headless")
opt.add_argument("--no-first-run")
opt.add_argument("--no-session-id")
opt.add_argument("--disable-background-networking")
opt.add_argument("--disable-client-side-phishing-detection")
opt.add_argument("--disable-cloud-import")
opt.add_argument("--disable-sync")
opt.add_argument("--proxy-auto-detect")
driver = os.path.join("/usr/lib/chromium-browser/", "chromedriver")

try:
    browser = webdriver.Chrome(executable_path=driver,chrome_options=opt,service_args=["--verbose", "--log-path=/home/r/chromedriver.log"])

    browser.maximize_window()
    browser.delete_all_cookies()
    browser.get("https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW?komunikaty=true&kontakt=true&okienkoSerwisowe=false")

    try:
        WebDriverWait(browser, 15).until(
            EC.presence_of_element_located((By.ID, "kodWydzialu"))
        )

        print "Zaladowano strone EKW"
    except:
        exception(browser)

    kodWydzialuInput = browser.find_element_by_id("kodWydzialuInput")
    kodWydzialuInput.click()

    time.sleep(random.random() + random.random())

    kodWydzialuInput.send_keys(kodWydzialu)

    numerKsiegiWieczystej = browser.find_element_by_id("numerKsiegiWieczystej")
    numerKsiegiWieczystej.click()

    time.sleep(random.random() + random.random())

    browser.execute_script("$(arguments[0]).val('" + numerKWx + "');", numerKsiegiWieczystej)
    # numerKsiegiWieczystej.send_keys(numerKWx)

    cyfraKontrolna = browser.find_element_by_id("cyfraKontrolna")
    cyfraKontrolna.click()

    time.sleep(random.random() + random.random())

    browser.execute_script("$(arguments[0]).val('" + cyfraKontrolnaX + "');", cyfraKontrolna)
    # cyfraKontrolna.send_keys(cyfraKontrolnaX)

    time.sleep(random.random() + random.random() + random.randint(1,2))

    wyszukaj = browser.find_element_by_id("wyszukaj")
    # browser.execute_script("$(arguments[0]).trigger('click');", wyszukaj)
    wyszukaj.click()

    print "Wyszukiwanie..."

    try:
        WebDriverWait(browser, 60).until(
            EC.presence_of_element_located((By.ID, "powrotDoKryterii"))
        )

        try:
            WebDriverWait(browser, 1).until(
                EC.presence_of_element_located((By.ID, "przyciskWydrukZupelny"))
            )

            print "Znaleziono KW!"
        except:
            print >> sys.stdout, "Nie znaleziono KW!"

            exist = 0

            sql = "INSERT INTO `ekw` (`sad`, `numer`, `ck`, `exists`) VALUES(%s, %s, %s, %s)"
            val = (kodWydzialu, numerKWx, cyfraKontrolnaX, exist)
            mycursor.execute(sql, val)

            mydb.commit()

            exception(browser)

        time.sleep(random.random() + 1)

        przyciskWydrukZupelny = browser.find_element_by_id("przyciskWydrukZupelny")

        time.sleep(random.random() + 1)
        browser.execute_script("$(arguments[0]).trigger('click');", przyciskWydrukZupelny)
        # przyciskWydrukZupelny.click()

        print "Pobieranie tresci 1/7 (podstawowe informacje)..."

        try:
            WebDriverWait(browser, 60).until(
                EC.presence_of_element_located((By.XPATH, "//input[@value='OKLADKA']"))
            )

            print "Pobieranie tresci 2/7 (okladka)... początek treści KW"

            time.sleep(1)

            okladka = browser.find_element_by_id('contentDzialu')
            okladkaVal = browser.execute_script("return $(arguments[0]).html();", okladka)
            okladkaFile = open(path + kodWydzialu + numerKWx + cyfraKontrolnaX + "_okladka.dat", "w+")
            okladkaFile.write(okladkaVal)
            okladkaFile.close()

            print "Pobieranie tresci 3/7 (oznaczenie nieruchomości)..."

            dzialIO = browser.find_element_by_xpath("//input[@value='Dział I-O']")

            time.sleep(random.random())
            browser.execute_script("$(arguments[0]).trigger('click');", dzialIO)

            WebDriverWait(browser, 60).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//*[contains(text(), 'DZIAŁ I-O - OZNACZENIE NIERUCHOMOŚCI')]"))
            )

            dIO = browser.find_element_by_id('contentDzialu')
            dIOVal = browser.execute_script("return $(arguments[0]).html();", dIO)
            dIOFile = open(path + kodWydzialu + numerKWx + cyfraKontrolnaX + "_adres.dat", "w+")
            dIOFile.write(dIOVal)
            dIOFile.close()

            print "Pobieranie tresci 4/7 (spis praw zw. z wlasn.)..."

            dzialIS = browser.find_element_by_xpath("//input[@value='Dział I-Sp']")

            time.sleep(random.random())
            browser.execute_script("$(arguments[0]).trigger('click');", dzialIS)

            WebDriverWait(browser, 60).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//*[contains(text(), 'DZIAŁ I-SP - SPIS PRAW ZWIĄZANYCH Z WŁASNOŚCIĄ')]"))
            )

            dIS = browser.find_element_by_id('contentDzialu')
            dISVal = browser.execute_script("return $(arguments[0]).html();", dIS)
            dISFile = open(path + kodWydzialu + numerKWx + cyfraKontrolnaX + "_prawa.dat", "w+")
            dISFile.write(dISVal)
            dISFile.close()

            print "Pobieranie tresci 5/7 (wlasnosc)..."

            dzialII = browser.find_element_by_xpath("//input[@value='Dział II']")

            time.sleep(random.random())
            browser.execute_script("$(arguments[0]).trigger('click');", dzialII)

            WebDriverWait(browser, 60).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'DZIAŁ II - WŁASNOŚĆ')]"))
            )

            dII = browser.find_element_by_id('contentDzialu')
            dIIVal = browser.execute_script("return $(arguments[0]).html();", dII)
            dIIFile = open(path + kodWydzialu + numerKWx + cyfraKontrolnaX + "_wlasc.dat", "w+")
            dIIFile.write(dIIVal)
            dIIFile.close()

            print "Pobieranie tresci 6/7 (prawa, roszczenia i ogran.)..."

            dzialIII = browser.find_element_by_xpath("//input[@value='Dział III']")

            time.sleep(random.random())
            browser.execute_script("$(arguments[0]).trigger('click');", dzialIII)

            WebDriverWait(browser, 60).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//*[contains(text(), 'DZIAŁ III - PRAWA, ROSZCZENIA I OGRANICZENIA')]"))
            )

            dIII = browser.find_element_by_id('contentDzialu')
            dIIIVal = browser.execute_script("return $(arguments[0]).html();", dIII)
            dIIIFile = open(path + kodWydzialu + numerKWx + cyfraKontrolnaX + "_roszcz.dat", "w+")
            dIIIFile.write(dIIIVal)
            dIIIFile.close()

            print "Pobieranie tresci 7/7 (hipoteka)..."

            dzialIV = browser.find_element_by_xpath("//input[@value='Dział IV']")

            time.sleep(random.random())
            browser.execute_script("$(arguments[0]).trigger('click');", dzialIV)

            WebDriverWait(browser, 60).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'DZIAŁ IV - HIPOTEKA')]"))
            )

            dIV = browser.find_element_by_id('contentDzialu')
            dIVVal = browser.execute_script("return $(arguments[0]).html();", dIV)
            dIVFile = open(path + kodWydzialu + numerKWx + cyfraKontrolnaX + "_hipo.dat", "w+")
            dIVFile.write(dIVVal)
            dIVFile.close()

            print "Zapisywanie do bazy danych..."

            sql = "INSERT INTO `ekw` (sad, numer, ck) VALUES(%s, %s, %s)"
            val = (kodWydzialu, numerKWx, cyfraKontrolnaX)
            mycursor.execute(sql, val)

            mydb.commit()

            # print(browser.page_source)

            exception(browser)
        except:
            exception(browser)
    except:
        print "Błąd krytyczny: nie udało się wczytać strony/CAPTCHA(?)"
        exception(browser)
except:
    exception(browser)
