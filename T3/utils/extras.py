def parseDate(date):
    date = str(date)
    list = date.split("-")
    return str(list[2]+"-"+list[1]+"-"+list[0])