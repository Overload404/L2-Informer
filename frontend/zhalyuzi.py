def button_a():
    global counter
    global broken
    found = False
    counter+=1
    if('open' not in blinds_d.values()):
        broken = True
    if broken == False:
        for i in blinds_d:
            if blinds_d[i]=='open':
                found = True
                blinds_d[i]='closed'
                if found==True and broken==False:
                    for l in blinds_d:
                        if l<i:
                            blinds_d[l]='open'
                        else:
                            pass
                    break
                else:
                    pass
    
def button_b():
    global counter
    global broken
    found = False
    counter= counter+1
    if('open' not in blinds_d.values()):
        broken = True
    if broken == False:
        for i in reversed(blinds_d):
            if blinds_d[i]=='open':
                found = True
                blinds_d[i]='closed'
                if found==True:
                    for l in blinds_d:
                        if l>i:
                            blinds_d[l]='open'
                        else:
                            pass
                    break
                else:
                    pass
   

def button_c():
    for i in blinds_d:
        blinds_d[i]='open'

blinds_l = range(1, int(input("Please enter the number of blinds: "))+1)

blinds_d = {}
counter = 0

for i in blinds_l:
    blinds_d[i] = "open"

broken = False
n=1
while broken==False:
    l=range(n)
    if broken==True:
        break
    else:
        for i in l:
            if broken!=True:
                button_a()
    if broken==True:
        break
    else:
        for i in l:
            if broken!=True:
                button_b()
        if broken==False:
            n=n*2
            print(f"closed:{list(blinds_d.values()).count('closed')/len(blinds_l)*100}%")

print(counter)

