'use strict';

const { lambda } = require("st-schema");

async function discoveryRequest(request, response) {
    console.log(JSON.stringify(request));
    response.addDevice('3rd-party-device-0001', 'Kitchen Light', 'c2c-color-temperature-bulb')
        .manufacturerName('Your Company')
        .modelName("Model A Tunable White Bulb")
        .hwVersion('v1 US Tunable White Bulb')
        .swVersion('1.0.0')
        .roomName('Kitchen')
        .addGroup('Kitchen Table Lights');
    console.log(response);
}

async function stateRefreshRequest(request, response) {
    console.log(JSON.stringify(request));
    const device = response.addDevice('3rd-party-device-0001');
    const component = device.addComponent('main');
    component.addState('st.switch', 'switch', 'off');
    component.addState('st.switchLevel', 'level', 80);
    component.addState('st.colorTemperature', 'colorTemperature', 3000);
    console.log(response);
}

async function commandRequest(request, response) {
    console.log(JSON.stringify(request));
    request.devices.forEach(async (it) => {
        const device = response.addDevice(it.externalDeviceId);
        const component = device.addComponent("main");
        it.commands.forEach(async (command) => {
            switch(command.capability) {
                case 'st.switch':
                    component.addState('st.switch', 'switch', command.command);
                    break;
                case 'st.switchLevel':
                    component.addState('st.switchLevel', 'level', command.arguments[0]);
                    break;
                case 'st.colorTemperature':
                    component.addState('st.colorTemperature', 'colorTemperature', command.arguments[0]);
                    break;
            }
        });
    });
    console.log(response);
}

module.exports.handler = lambda({
    discoveryRequest,
    commandRequest,
    stateRefreshRequest
});