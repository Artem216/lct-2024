import csv
from typing import Union, List

from fastapi import FastAPI, File, UploadFile

from config import logger

def find_row_by_id(file: Union[str, UploadFile], id_value):
    """
    Находит и возвращает строку из CSV-файла, содержащую указанное значение ID.

    Args:
        file (Union[str, UploadFile]): Путь к CSV-файлу или объект UploadFile, содержащий CSV-данные.
        id_value (int): Значение ID, которое нужно найти в файле.

    Returns:
        Union[dict, None]: Если строка с указанным ID найдена, возвращается словарь, представляющий эту строку.
        Если строка не найдена, возвращается `None`.
    """
    if isinstance(file, str):
        with open(file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['id'] == str(id_value):
                    return row
                
    elif isinstance(file, UploadFile):
        lines = file.file.readlines()
        reader = csv.DictReader(line.decode().strip() for line in lines)
        for row in reader:
            if row['id'] == str(id_value):
                return row
    return None


def get_values_by_cluster(file: Union[str, UploadFile], cluster_value: str) -> List[dict]:
    """
    Возвращает список словарей, содержащих все строки с заданным значением в столбце "cluster".

    Args:
        file (Union[str, UploadFile]): Путь к файлу или объект UploadFile.
        cluster_value (str): Значение, по которому нужно фильтровать строки.

    Returns:
        List[dict]: Список словарей, представляющих все найденные строки.
    """
    result = []
    if isinstance(file, str):
        with open(file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['super_clust'] == cluster_value:
                    result.append(row)
                
    elif isinstance(file, UploadFile):
        lines = file.file.readlines()
        reader = csv.DictReader(line.decode().strip() for line in lines)
        for row in reader:
            if row['super_clust'] == cluster_value:
                result.append(row)

    return result