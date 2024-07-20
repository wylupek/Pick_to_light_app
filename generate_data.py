import random

path = 'data.txt'
records_num = 25
max_supplier = 5
box_num = 96
max_products_int_box = 20
chance_of_product_int_box = 0.2

with open(path, 'w') as file:
    for i in range(records_num):
        id_num = random.randint(1, max_supplier)
        row = f"{id_num};Supplier {id_num};{i+1:03}0123456789;Product {i+1};" 
        
        total_products = 0
        tmp = ""
        for j in range(box_num):
            if (random.randint(1, 100)/100) < (chance_of_product_int_box):
                products_num = random.randint(1, max_products_int_box)
                tmp += f"{j+1}-{products_num};"
                total_products += products_num
        if tmp == "":
            in_box = random.randint(1, box_num)
            products_num = random.randint(1, max_products_int_box)
            tmp += f"{j+1}-{products_num};"
            total_products += products_num
        row += f"{total_products};{tmp[:-1]}\n"
        file.write(row)