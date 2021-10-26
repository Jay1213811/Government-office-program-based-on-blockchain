#最新版本服务器
miniProgramAppID = "wxa00c3e706ee7d889"
miniProgramApp = "d71eabe10b72eb7836aaaa68bc245cf1"



# 七牛云key
AccessKey = '3QeKd51jEBv62Wvxn8QPSkRBdVCm1nT1XdwAF4Zi'
SecretKey = '115kaklqgLgmISwzrHHgOIBDYb_fYH2Kp1Ff7JFN'
Bucket = "onestop-gym"
policy = {  # 七牛云上传策略——https://developer.qiniu.com/kodo/manual/1206/put-policy
    'callbackUrl': 'get_qiniu_info',  # 回调URL 上传成功后，七牛云向业务服务器发送 POST 请求的 URL。
    'callbackHost': 'blockchain.luckydraw.net.cn',
    # 回调URL指定的Host 上传成功后，七牛云向业务服务器发送回调通知时的 Host 值。与 callbackUrl 配合使用，仅当设置了 callbackUrl 时才有效。
    'callbackBodyType': 'application/json',
    # 回调Body的Content-Type 上传成功后，七牛云向业务服务器发送回调通知 callbackBody 的 Content-Type。默认为 application/x-www-form-urlencoded，也可设置为 application/json。
    "mimeLimit": 'image/*',  # 只允许上传图片类型
}   