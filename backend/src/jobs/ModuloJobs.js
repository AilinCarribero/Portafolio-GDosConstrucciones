const { Alquiler, Modulo, ModuloDoble } = require("../../db");

exports.estadoModulos = () => {
    Modulo.findAll({
        include: [
            {
                model: Alquiler
            }, {
                model: ModuloDoble
            }
        ],
        order: [[Alquiler, 'fecha_h_alquiler', 'DESC']]
    }).then(response => {
        response.map(modulo => {
            /* Para que no se siga actualizando al pedo el estado se debe:
            - Leer el primer alquiler que llega
            - Analizar de acuerdo a los datos del primer alquiler que estado corresponde
            */
           
            /*  0 => Libre / 1 => Alquilado / 2 => Vendido / 3 => En espera  */
            if (!modulo.vinculado) {
                if (modulo.estado != 2) {
                    if (modulo.alquilers.length > 0) {
                        //Si la fecha esta entre la de inicio y la final
                        if (modulo.estado == 0 && modulo.alquilers[0].fecha_d_alquiler <= new Date() && modulo.alquilers[0].fecha_h_alquiler >= new Date()) {
                            Modulo.update({ estado: 1 }, {
                                where: {
                                    id_modulo: modulo.id_modulo
                                }
                            }).then(response => {
                                console.log('Estado del modulo actualizado a "Alquilado"');
                            }).catch(err => {
                                console.error(err)
                            })

                            //Si la fecha de finalizacion es menor a la actual
                        } else if (modulo.estado == 1 && modulo.alquilers[0].fecha_h_alquiler < new Date()) {
                            Modulo.update({ estado: 0 }, {
                                where: {
                                    id_modulo: modulo.id_modulo
                                }
                            }).then(response => {
                                console.log('Estado del modulo actualizado a "Disponible"');
                            }).catch(err => {
                                console.error(err)
                            })

                            //Si la fecha de inicio es mayor a la actual
                        } else if (modulo.alquilers[0].fecha_d_alquiler > new Date()) {
                            /* Si la ultima fecha de inicio es mayor a la actual debe revisar el otro alquiler, si no existe entonces esta en "en espera", sino debe revisar si 
                            la fecha actual esta en este alquiler, sino revisar el siguiente */
                            for (let i = modulo.alquilers.length - 1; i >= 0; i--) {
                                if (modulo.alquilers[i].fecha_d_alquiler <= new Date() && modulo.alquilers[i].fecha_h_alquiler >= new Date()) {
                                    if (modulo.estado != 1) {
                                        Modulo.update({ estado: 1 }, {
                                            where: {
                                                id_modulo: modulo.id_modulo
                                            }
                                        }).then(response => {
                                            console.log('Estado del modulo actualizado a "Alquilado"');
                                        }).catch(err => {
                                            console.error(err)
                                        });
                                    }

                                    break;
                                } else if (modulo.alquilers[i].fecha_d_alquiler > new Date()) {
                                    if (modulo.estado != 3) {
                                        Modulo.update({ estado: 3 }, {
                                            where: {
                                                id_modulo: modulo.id_modulo
                                            }
                                        }).then(response => {
                                            console.log('Estado del modulo actualizado a "En Espera"');
                                        }).catch(err => {
                                            console.error(err)
                                        });
                                    }

                                    break;
                                }
                            }
                        }
                    } else {
                        if (modulo.estado == 1) {
                            Modulo.update({ estado: 0 }, {
                                where: {
                                    id_modulo: modulo.id_modulo
                                }
                            }).then(response => {
                                console.log('Estado del modulo SIN ALQUILERES actualizado a "Disponible"');
                            }).catch(err => {
                                console.error(err)
                            })
                        }
                    }
                }
            }
        })
    }).catch(error => {
        console.error(error);
    });
}

exports.estadoModulosDobles = () => {
    ModuloDoble.findAll({
        include: [
            {
                model: Alquiler
            }, {
                model: Modulo,
                as: 'moduloUno',
                include: [{
                    model: Alquiler
                },
                ]
            }, {
                model: Modulo,
                as: 'moduloDos',
                include: [{
                    model: Alquiler
                },
                ]
            }
        ],
        order: [[Alquiler, 'fecha_h_alquiler', 'DESC']]
    }).then(response => {
        response.map(moduloDoble => {
            /* Para que no se siga actualizando al pedo el estado se debe:
            - Leer el primer alquiler que llega
            - Analizar de acuerdo a los datos del primer alquiler que estado corresponde
            */
console.log(moduloDoble.estado, moduloDoble.moduloUno.estado, moduloDoble.moduloDos.estado)
            /*  0 => Libre / 1 => Alquilado / 2 => Vendido / 3 => En espera  */

            if(moduloDoble.estado != moduloDoble.moduloUno.estado || moduloDoble.estado != moduloDoble.moduloDos.estado) {
                Modulo.update({ estado: moduloDoble.estado }, {
                    where: {
                        id_modulo: moduloDoble.id_modulo_uno
                    }
                }).then(response => {
                    console.log('Estado del modulo uno actualizado al estado del modulo doble padre');
                }).catch(err => {
                    console.error(err)
                });

                Modulo.update({ estado: moduloDoble.estado }, {
                    where: {
                        id_modulo: moduloDoble.id_modulo_dos
                    }
                }).then(response => {
                    console.log('Estado del modulo dos actualizado al estado del modulo doble padre');
                }).catch(err => {
                    console.error(err)
                });
            }

            if (moduloDoble.estado != 2) {
                if (moduloDoble.alquilers.length > 0) {
                    //Si la fecha esta entre la de inicio y la final
                    if (moduloDoble.estado == 0 && moduloDoble.alquilers[0].fecha_d_alquiler <= new Date() && moduloDoble.alquilers[0].fecha_h_alquiler >= new Date()) {
                        ModuloDoble.update({ estado: 1 }, {
                            where: {
                                id_modulo_doble: moduloDoble.id_modulo_doble
                            }
                        }).then(response => {
                            Modulo.update({ estado: 1 }, {
                                where: {
                                    id_modulo: moduloDoble.id_modulo_uno
                                }
                            }).then(response => {
                                console.log('Estado del modulo uno actualizado a "Alquilado"');
                            }).catch(err => {
                                console.error(err)
                            });

                            Modulo.update({ estado: 1 }, {
                                where: {
                                    id_modulo: moduloDoble.id_modulo_dos
                                }
                            }).then(response => {
                                console.log('Estado del modulo dos actualizado a "Alquilado"');
                            }).catch(err => {
                                console.error(err)
                            });

                            console.log('Estado del modulo doble actualizado a "Alquilado"');
                        }).catch(err => {
                            console.error(err)
                        })

                        //Si la fecha de finalizacion es menor a la actual
                    } else if (moduloDoble.estado == 1 && moduloDoble.alquilers[0].fecha_h_alquiler < new Date()) {
                        ModuloDoble.update({ estado: 0 }, {
                            where: {
                                id_modulo_doble: moduloDoble.id_modulo_doble
                            }
                        }).then(response => {
                            Modulo.update({ estado: 0 }, {
                                where: {
                                    id_modulo: moduloDoble.id_modulo_uno
                                }
                            }).then(response => {
                                console.log('Estado del modulo uno actualizado a "Disponible"');
                            }).catch(err => {
                                console.error(err)
                            });

                            Modulo.update({ estado: 0 }, {
                                where: {
                                    id_modulo: moduloDoble.id_modulo_dos
                                }
                            }).then(response => {
                                console.log('Estado del modulo dos actualizado a "Disponible"');
                            }).catch(err => {
                                console.error(err)
                            });

                            console.log('Estado del modulo doble actualizado a "Disponible"');
                        }).catch(err => {
                            console.error(err)
                        })

                        //Si la fecha de inicio es mayor a la actual
                    } else if (moduloDoble.alquilers[0].fecha_d_alquiler > new Date()) {
                        /* Si la ultima fecha de inicio es mayor a la actual debe revisar el otro alquiler, si no existe entonces esta en "en espera", sino debe revisar si 
                        la fecha actual esta en este alquiler, sino revisar el siguiente */
                        for (let i = moduloDoble.alquilers.length - 1; i >= 0; i--) {
                            if (moduloDoble.alquilers[i].fecha_d_alquiler <= new Date() && moduloDoble.alquilers[i].fecha_h_alquiler >= new Date()) {
                                if (moduloDoble.estado != 1) {
                                    ModuloDoble.update({ estado: 1 }, {
                                        where: {
                                            id_modulo_doble: moduloDoble.id_modulo_doble
                                        }
                                    }).then(response => {
                                        Modulo.update({ estado: 1 }, {
                                            where: {
                                                id_modulo: moduloDoble.id_modulo_uno
                                            }
                                        }).then(response => {
                                            console.log('Estado del modulo uno actualizado a "Alquilado"');
                                        }).catch(err => {
                                            console.error(err)
                                        });

                                        Modulo.update({ estado: 1 }, {
                                            where: {
                                                id_modulo: moduloDoble.id_modulo_dos
                                            }
                                        }).then(response => {
                                            console.log('Estado del modulo dos actualizado a "Alquilado"');
                                        }).catch(err => {
                                            console.error(err)
                                        });

                                        console.log('Estado del modulo doble actualizado a "Alquilado"');
                                    }).catch(err => {
                                        console.error(err)
                                    });
                                }

                                break;
                            } else if (moduloDoble.alquilers[i].fecha_d_alquiler > new Date()) {
                                if (moduloDoble.estado != 3) {
                                    ModuloDoble.update({ estado: 3 }, {
                                        where: {
                                            id_modulo_doble: moduloDoble.id_modulo_doble
                                        }
                                    }).then(response => {
                                        Modulo.update({ estado: 3 }, {
                                            where: {
                                                id_modulo: moduloDoble.id_modulo_uno
                                            }
                                        }).then(response => {
                                            console.log('Estado del modulo uno actualizado a "En Espera"');
                                        }).catch(err => {
                                            console.error(err)
                                        });

                                        Modulo.update({ estado: 3 }, {
                                            where: {
                                                id_modulo: moduloDoble.id_modulo_dos
                                            }
                                        }).then(response => {
                                            console.log('Estado del modulo dos actualizado a "En Espera"');
                                        }).catch(err => {
                                            console.error(err)
                                        });

                                        console.log('Estado del modulo doble actualizado a "En Espera"');
                                    }).catch(err => {
                                        console.error(err)
                                    });
                                }

                                break;
                            }
                        }
                    }
                } else {
                    if (moduloDoble.estado == 1) {
                        ModuloDoble.update({ estado: 0 }, {
                            where: {
                                id_modulo_doble: moduloDoble.id_modulo_doble
                            }
                        }).then(response => {
                            Modulo.update({ estado: 0 }, {
                                where: {
                                    id_modulo: moduloDoble.id_modulo_uno
                                }
                            }).then(response => {
                                console.log('Estado del modulo uno actualizado a "Disponible"');
                            }).catch(err => {
                                console.error(err)
                            });

                            Modulo.update({ estado: 0 }, {
                                where: {
                                    id_modulo: moduloDoble.id_modulo_dos
                                }
                            }).then(response => {
                                console.log('Estado del modulo dos actualizado a "Disponible"');
                            }).catch(err => {
                                console.error(err)
                            });

                            console.log('Estado del modulo doble SIN ALQUILERES actualizado a "Disponible"');
                        }).catch(err => {
                            console.error(err)
                        })
                    }
                }
            }
        })
    }).catch(error => {
        console.error(error);
    })
}