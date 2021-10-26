import json
import re

import requests

from collections import defaultdict
import re
import os.path

base_path = os.path.dirname(os.path.realpath(__file__))  # 获取当前路径


__all__ = ['NaiveFilter', 'BSFilter', 'DFAFilter']
__author__ = 'observer'
__date__ = '2012.01.05'

from idna import unicode


class NaiveFilter():
    '''Filter Messages from keywords.txt
    very simple filter implementation
    >>> f = NaiveFilter()
    >>> f.add("sexy")
    >>> f.filter("hello sexy baby")
    hello **** baby
    '''

    def __init__(self):
        self.keywords = set([])

    def parse(self, path):
        for keyword in open(path):
            self.keywords.add(keyword.strip().decode('utf-8').lower())

    def filter(self, message, repl="*"):
        message = unicode(message).lower()
        for kw in self.keywords:
            message = message.replace(kw, repl)
        return message


class BSFilter:
    '''Filter Messages from keywords.txt
    Use Back Sorted Mapping to reduce replacement times
    >>> f = BSFilter()
    >>> f.add("sexy")
    >>> f.filter("hello sexy baby")
    hello **** baby
    '''

    def __init__(self):
        self.keywords = []
        self.kwsets = set([])
        self.bsdict = defaultdict(set)
        self.pat_en = re.compile(r'^[0-9a-zA-Z]+$')  # english phrase or not

    def add(self, keyword):
        if not isinstance(keyword, unicode):
            keyword = keyword.decode('utf-8')
        keyword = keyword.lower()
        if keyword not in self.kwsets:
            self.keywords.append(keyword)
            self.kwsets.add(keyword)
            index = len(self.keywords) - 1
            for word in keyword.split():
                if self.pat_en.search(word):
                    self.bsdict[word].add(index)
                else:
                    for char in word:
                        self.bsdict[char].add(index)

    def parse(self, path):
        with open(path, "r") as f:
            for keyword in f:
                self.add(keyword.strip())

    def filter(self, message, repl="*"):
        if not isinstance(message, unicode):
            message = message.decode('utf-8')
        message = message.lower()
        for word in message.split():
            if self.pat_en.search(word):
                for index in self.bsdict[word]:
                    message = message.replace(self.keywords[index], repl)
            else:
                for char in word:
                    for index in self.bsdict[char]:
                        message = message.replace(self.keywords[index], repl)
        return message


class DFAFilter():
    '''Filter Messages from keywords.txt
    Use DFA to keep algorithm perform constantly
    >>> f = DFAFilter()
    >>> f.add("sexy")
    >>> f.filter("hello sexy baby")
    hello **** baby
    '''

    def __init__(self):
        self.keyword_chains = {}
        self.delimit = '\x00'

    def add(self, keyword):
        if not isinstance(keyword, unicode):
            keyword = keyword.decode('utf-8')
        keyword = keyword.lower()
        chars = keyword.strip()
        if not chars:
            return
        level = self.keyword_chains
        for i in range(len(chars)):
            if chars[i] in level:
                level = level[chars[i]]
            else:
                if not isinstance(level, dict):
                    break
                for j in range(i, len(chars)):
                    level[chars[j]] = {}
                    last_level, last_char = level, chars[j]
                    level = level[chars[j]]
                last_level[last_char] = {self.delimit: 0}
                break
        if i == len(chars) - 1:
            level[self.delimit] = 0

    def parse(self, path):
        file_path = os.path.join(base_path, path)
        with open(file_path) as f:
            for keyword in f:
                self.add(keyword.strip())

    def filter(self, message, repl="*"):
        if not isinstance(message, unicode):
            message = message.decode('utf-8')
        message = message.lower()
        ret = []
        start = 0
        while start < len(message):
            level = self.keyword_chains
            step_ins = 0
            for char in message[start:]:
                if char in level:
                    step_ins += 1
                    if self.delimit not in level[char]:
                        level = level[char]
                    else:
                        ret.append(repl * step_ins)
                        start += step_ins - 1
                        break
                else:
                    ret.append(message[start])
                    break
            else:
                ret.append(message[start])
            start += 1

        return ''.join(ret)


def checkContent(content):
    gfw = DFAFilter()
    gfw.parse("keywords.txt")
    number = len(content.split("*"))-1
    text = gfw.filter(content, "*")
    data = {"num": len(text.split("*"))-1-number, "text": text}
    return data



"""def checkContent(keywords.txt, text):
    return re.sub("|".join(keywords.txt), "***", text)


url = 'https://api.hcfpz.cn/other/search-ban-word'
title = '哈哈哈哈艹'
content = '哈哈哈哈fuck大师傅艹 草'
data = {'content': title + content}
result = requests.post(url, data)
print(result)
print(result.text)
print(result.content)
print(result.json())
obj = result.json()
sensitiveWordArr = obj['data']['result']['minganArr']
print(sensitiveWordArr)"""
"""sensitiveWordCount = result.result.minganCount
forbiddenWordArr = result.result.weijinArr
forbiddenWordCount = result.result.weijinCount
count = result.result.minganCount + result.result.weijinCount
arr = result.result.minganArr.extent(result.result.weijinArr)
print(checkContent(arr, title))
print(checkContent(arr, content))"""
