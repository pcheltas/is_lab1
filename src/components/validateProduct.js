export const validateProduct = (product) => {
    const newErrors = {};
    if (!product.name) {
        newErrors.name = 'Название не может быть пустым';
    }
    if (!product.unitOfMeasure) {
        newErrors.unitOfMeasure = 'Единица мзмерения не может быть пустой';
    }
    if (!product.price) {
        newErrors.price = 'Стоимость не может быть пустой';
    } else if (!/^(\d+|\d+\.\d+)$/.test(product.price)) {
        newErrors.price = 'Стоимость должна быть числом';
    }
    if (!product.manufactureCost) {
        newErrors.manufactureCost = 'Себестоимость не может быть пустой';
    } else if (!/^(\d+|\d+\.\d+)$/.test(product.manufactureCost)) {
        newErrors.manufactureCost = 'Себестоимость должна быть числом';
    }
    if (!product.rating) {
        newErrors.rating = 'Рейтинг не может быть пустым';
    }  else if (!/^(0|([1-9][0-9]*)(\.[0-9]+)?)$/.test(product.manufacturer.rating)) {
        newErrors.manufacturerRating = 'Рейтинг должен быть числом, не меньше 0';
    }
    if (!product.coordinates.x) {
        newErrors.coordinatesX = 'Координата X не может быть пустой';
    } else if (!/^\d+(\.\d+)?$/.test(product.coordinates.x)) {
        newErrors.coordinatesX = 'Координата X должна быть числом';
    }
    if (!product.coordinates.y) {
        newErrors.coordinatesY = 'Координата Y не может быть пустой';
    } else if (!/^\d+(\.\d+)?$/.test(product.coordinates.y)) {
        newErrors.coordinatesY = 'Координата Y должна быть числом';
    }
    if (!product.owner.name) {
        newErrors.ownerName = 'Имя владельца не может быть пустым';
    }
    if (!product.owner.eyeColor) {
        newErrors.ownerEyeColor = 'Цвет глаз не может быть пустым';
    }
    if (!product.owner.hairColor) {
        newErrors.ownerHairColor = 'Цвет волос не может быть пустым';
    }
    if (!product.owner.height) {
        newErrors.ownerHeight = 'Рост не может быть пустым';
    } else if (!/^\d+(\.\d+)?$/.test(product.owner.height)) {
        newErrors.ownerHeight = 'Рост должен быть числом';
    }
    if (!product.owner.nationality) {
        newErrors.ownerNationality = 'Национальность не может быть пустой';
    }
    if (!product.owner.location.x) {
        newErrors.ownerLocationX = 'Координата X не может быть пустой';
    } else if (!/^\d+(\.\d+)?$/.test(product.owner.location.x)) {
        newErrors.ownerLocationX = 'Координата X должна быть числом';
    }
    if (!product.owner.location.y) {
        newErrors.ownerLocationY = 'Координата Y не может быть пустой';
    } else if (!/^\d+(\.\d+)?$/.test(product.owner.location.y)) {
        newErrors.ownerLocationY = 'Координата Y должна быть числом';
    }
    if (!product.owner.location.z) {
        newErrors.ownerLocationZ = 'Координата Z не может быть пустой';
    } else if (!/^\d+(\.\d+)?$/.test(product.owner.location.z)) {
        newErrors.ownerLocationZ = 'Координата Z должна быть числом';
    }
    if (!product.owner.location.name) {
        newErrors.ownerLocationName = 'Название не может быть пустым';
    }
    if (!product.manufacturer.name) {
        newErrors.manufacturerName = 'Название производителя не может быть пустым';
    }
    if (!product.manufacturer.annualTurnover) {
        newErrors.annualTurnover = 'Ежегодный оборот не может быть пустым';
    } else if (!/^\d+(\.\d+)?$/.test(product.manufacturer.annualTurnover)) {
        newErrors.annualTurnover = 'Ежегодный оборот должен быть числом';
    }
    if (!product.manufacturer.employeesCount) {
        newErrors.employeesCount = 'Количество работников не может быть пустым';
    } else if (!/^\d+$/.test(product.manufacturer.employeesCount)) {
        newErrors.employeesCount = 'Количество работников должно быть целым числом';
    }
    if (!product.manufacturer.rating) {
        newErrors.manufacturerRating = 'Рейтинг производителя не может быть пустым';
    }  else if (!/^(0|([1-9][0-9]*)(\.[0-9]+)?)$/.test(product.manufacturer.rating)) {
        newErrors.manufacturerRating = 'Рейтинг производителя должен быть числом, не меньше 0';
    }
    if (!product.manufacturer.fullName) {
        newErrors.fullName = 'Полное название не может быть пустым';
    }
    if (!product.manufacturer.officialAddress.zipCode) {
        newErrors.zipCode = 'Индекс не может быть пустым';
    }
    const town = product.manufacturer.officialAddress.town;
    if (!town.x) {
        newErrors.townX = 'Координата X города не может быть пустой';
    } else if (!/^\d+(\.\d+)?$/.test(town.x)) {
        newErrors.townX = 'Координата X города должна быть числом';
    }
    if (!town.y) {
        newErrors.townY = 'Координата Y города не может быть пустой';
    } else if (!/^\d+(\.\d+)?$/.test(town.y)) {
        newErrors.townY = 'Координата Y города должна быть числом';
    }
    if (!town.z) {
        newErrors.townZ = 'Координата Z города не может быть пустой';
    } else if (!/^\d+(\.\d+)?$/.test(town.z)) {
        newErrors.townZ = 'Координата Z города должна быть числом';
    }
    if (!town.name) {
        newErrors.townName = 'Название города не может быть пустым';
    }
    return newErrors;
}