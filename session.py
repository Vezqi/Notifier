import requests
import time

s = requests.Session()
a = s.get('https://www2.kickassanime.rs/')
print(a.text)

time.sleep(5)
print('----------------------')

b = s.get('https://www2.kickassanime.rs/')
print(b.text)