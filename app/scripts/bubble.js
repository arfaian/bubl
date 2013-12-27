function gauss(x, sigma) {
    return Math.exp(-(x * x) / (2.0 * sigma * sigma));
}

function buildKernel(sigma) {
    var kMaxKernelSize = 25;
    var kernelSize = 2 * Math.ceil(sigma * 3.0) + 1;
    if (kernelSize > kMaxKernelSize)
        kernelSize = kMaxKernelSize;
    var halfWidth = (kernelSize - 1) * 0.5
    var values = new Array(kernelSize);
    var sum = 0.0;
    for (var i = 0; i < kernelSize; ++i) {
        values[i] = gauss(i - halfWidth, sigma);
        sum += values[i];
    }
    for (var i = 0; i < kernelSize; ++i)
        values[i] /= sum;
    return values;
}

/*
function gauss(x, sigma) {
    return Math.exp(-(x * x) / (2.0 * sigma * sigma));
}

function buildKernel(sigma) {
    var kMaxKernelSize = 25;
    var kernelSize = 2 * Math.ceil(sigma * 3.0) + 1;
    if (kernelSize > kMaxKernelSize)
        kernelSize = kMaxKernelSize;
    var halfWidth = (kernelSize - 1) * 0.5
    var values = new Array(kernelSize);
    var sum = 0.0;
    for (var i = 0; i < kernelSize; ++i) {
        values[i] = gauss(i - halfWidth, sigma);
        sum += values[i];
    }
    for (var i = 0; i < kernelSize; ++i)
        values[i] /= sum;
    return values;
}

var ShaderTest = {
    'hatching': {
        uniforms: {
            "uDirLightPos": {
                type: "v3",
                value: new THREE.Vector3()
            },
            "uDirLightColor": {
                type: "c",
                value: new THREE.Color(0xeeeeee)
            },
            "uAmbientLightColor": {
                type: "c",
                value: new THREE.Color(0x050505)
            },
            "uBaseColor": {
                type: "c",
                value: new THREE.Color(0xffffff)
            },
            "uLineColor1": {
                type: "c",
                value: new THREE.Color(0x000000)
            },
            "uLineColor2": {
                type: "c",
                value: new THREE.Color(0x000000)
            },
            "uLineColor3": {
                type: "c",
                value: new THREE.Color(0x000000)
            },
            "uLineColor4": {
                type: "c",
                value: new THREE.Color(0x000000)
            }
        },
        vertex_shader: document.getElementById('vs').textContent,
        fragment_shader: document.getElementById('fs').textContent
    }
};

var cameraOrtho, cameraPerspective, sceneRTT, sceneScreen, sceneBG, renderer, mesh, directionalLight;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var rtTexture, materialScreen, materialConvolution, blurx, blury, quadBG, quadScreen;
cameraOrtho = new THREE.Camera();
cameraOrtho.projectionMatrix = new THREE.Matrix4().makeOrthographic(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10000, 10000);
cameraOrtho.position.z = 100;
cameraPerspective = new THREE.Camera(50, window.innerWidth / window.innerHeight, 1, 10000);
cameraPerspective.position.z = 900;
sceneRTT = new THREE.Scene();
sceneScreen = new THREE.Scene();
sceneBG = new THREE.Scene();
sceneRTT.add(cameraPerspective);
sceneBG.add(cameraOrtho);
sceneScreen.add(cameraOrtho);
directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.x = 0;
directionalLight.position.y = 0;
directionalLight.position.z = 1;
directionalLight.position.normalize();
sceneRTT.add(directionalLight);
rtTexture1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    min_filter: THREE.LinearFilter,
    mag_filter: THREE.LinearFilter
});
rtTexture2 = new THREE.WebGLRenderTarget(256, 512, {
    min_filter: THREE.LinearFilter,
    mag_filter: THREE.LinearFilter
});
rtTexture3 = new THREE.WebGLRenderTarget(512, 256, {
    min_filter: THREE.LinearFilter,
    mag_filter: THREE.LinearFilter
});
materialScreen = new THREE.ShaderMaterial({
    uniforms: {
        tDiffuse: {
            type: "t",
            value: 0,
            texture: rtTexture1
        },
        opacity: {
            type: "f",
            value: 0.4
        }
    },
    vertex_shader: document.getElementById('vs-generic').textContent,
    fragment_shader: document.getElementById('fs-screen').textContent,
    blending: THREE.AdditiveBlending
});
var kernel = buildKernel(4.0);
blurx = new THREE.Vector2(0.001953125, 0.0), blury = new THREE.Vector2(0.0, 0.001953125);
materialConvolution = new THREE.ShaderMaterial({
    uniforms: {
        tDiffuse: {
            type: "t",
            value: 0,
            texture: rtTexture1
        },
        uImageIncrement: {
            type: "v2",
            value: blury
        },
        cKernel: {
            type: "fv1",
            value: kernel
        }
    },
    vertex_shader: document.getElementById('vs-convolution').textContent,
    fragment_shader: document.getElementById('fs-convolution').textContent
});

var plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

shader = ShaderTest["hatching"];
material1 = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(shader.uniforms),
    vertex_shader: shader.vertex_shader,
    fragment_shader: shader.fragment_shader
});

material1.uniforms.uDirLightPos.value = directionalLight.position;

var lineColor1 = 0xff0000;
material1.uniforms.uBaseColor.value.setHex(0x000000);
material1.uniforms.uLineColor1.value.setHex(lineColor1);
material1.uniforms.uLineColor2.value.setHex(lineColor1);
material1.uniforms.uLineColor3.value.setHex(lineColor1);
material1.uniforms.uLineColor4.value.setHex(0xffff00);

quadScreen = new THREE.Mesh(plane, materialConvolution);
quadScreen.position.z = -100;
sceneScreen.add(quadScreen);

var radius = 50,
    segments = 16,
    rings = 16;

function createMesh(geometry, scene, scale) {
    var mesh = new THREE.Mesh(geometry, material1);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
    mesh.position.x = -300;
    mesh.position.y = -50;
    scene.add(mesh);
}

var sphere = createMesh(new THREE.SphereGeometry(radius, segments, rings), sceneRTT, 100);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;

var $container = $('container');
$container.append(renderer.domElement);

function draw() {
    renderer.clear();
    renderer.context.disable(renderer.context.DEPTH_TEST);
    renderer.render(sceneBG, cameraOrtho, rtTexture1);
    renderer.context.enable(renderer.context.DEPTH_TEST);
    renderer.render(sceneRTT, cameraPerspective, rtTexture1);
    quadScreen.materials = [materialConvolution];
    materialConvolution.uniforms.tDiffuse.texture = rtTexture1;
    materialConvolution.uniforms.uImageIncrement.value = blurx;
    renderer.render(sceneScreen, cameraOrtho, rtTexture2);
    materialConvolution.uniforms.tDiffuse.texture = rtTexture2;
    materialConvolution.uniforms.uImageIncrement.value = blury;
    renderer.render(sceneScreen, cameraOrtho, rtTexture3);
    quadScreen.materials = [materialScreen];
    materialScreen.uniforms.tDiffuse.texture = rtTexture3;
    materialScreen.uniforms.opacity.value = 1.5;
    renderer.render(sceneScreen, cameraOrtho, rtTexture1, false);
    materialScreen.uniforms.tDiffuse.texture = rtTexture1;
    renderer.render(sceneScreen, cameraOrtho);

    requestAnimationFrame(draw);
}

$(document).ready(function () {
    draw();
});
*/

var scene = new THREE.Scene();
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
camera.position.z = 320;
scene.add(camera);

// Set the background color of the scene.
renderer.setClearColor(0x000000, 1);

/*
var light = new THREE.DirectionalLight(0xffffff);
light.position.x = 2;
light.position.y = 0;
light.position.z = 3;
light.position.normalize();
*/
var light = new THREE.PointLight(0xffffff);
light.position.set(2,-2,-3);
light.intensity = 0.1;
light.distance = 10000;
scene.add(light);

var shader = {
    uniforms: {
        "uDirLightPos": {
            type: "v3",
            value: new THREE.Vector3()
        },
        "uDirLightColor": {
            type: "c",
            value: new THREE.Color(0xeeeeee)
        },
        "uAmbientLightColor": {
            type: "c",
            value: new THREE.Color(0x050505)
        },
        "uBaseColor": {
            type: "c",
            value: new THREE.Color(0xffffff)
        },
        "uLineColor1": {
            type: "c",
            value: new THREE.Color(0x000000)
        },
        "uLineColor2": {
            type: "c",
            value: new THREE.Color(0x000000)
        },
        "uLineColor3": {
            type: "c",
            value: new THREE.Color(0x000000)
        },
        "uLineColor4": {
            type: "c",
            value: new THREE.Color(0x000000)
        }
    },
    vertexShader: document.getElementById('vs').textContent,
    fragmentShader: document.getElementById('fs').textContent
};

var material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(shader.uniforms),
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader
});

material.uniforms.uDirLightPos.value = light.position;
material.uniforms.uDirLightColor.value = light.color;

var lineColor1 = 0xff0000;
material.uniforms.uBaseColor.value.setHex(0x000000);
material.uniforms.uLineColor1.value.setHex(lineColor1);
material.uniforms.uLineColor2.value.setHex(lineColor1);
material.uniforms.uLineColor3.value.setHex(lineColor1);
material.uniforms.uLineColor4.value.setHex(0xffff00);

var sphere = new THREE.Mesh(new THREE.SphereGeometry(100, 60, 60), material);
var cube = new THREE.Mesh(new THREE.CubeGeometry(100, 60, 60), material);
cube.position.x = -300;
cube.rotation.x = -10;

scene.add(sphere);
scene.add(cube);

var rtTexture1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {minFilter: THREE.LinearFilter,magFilter: THREE.LinearFilter});
var materialScreen = new THREE.ShaderMaterial({uniforms: {tDiffuse: {type: "t",value: 0,texture: rtTexture1},opacity: {type: "f",value: 0.4}},vertexShader: document.getElementById('vs-generic').textContent,fragmentShader: document.getElementById('fs-screen').textContent,blending: THREE.AdditiveBlending});
var kernel = buildKernel(4.0);
var blurx = new THREE.Vector2(0.001953125, 0.0);
var blury = new THREE.Vector2(0.0, 0.001953125);
var materialConvolution = new THREE.ShaderMaterial({uniforms: {tDiffuse: {type: "t",value: 0,texture: rtTexture1},uImageIncrement: {type: "v2",value: blury},cKernel: {type: "fv1",value: kernel}},vertexShader: document.getElementById('vs-convolution').textContent,fragmentShader: document.getElementById('fs-convolution').textContent});

var cameraOrtho = new THREE.Camera();
cameraOrtho.projectionMatrix = THREE.Matrix4.makeOrtho(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10000, 10000);
cameraOrtho.position.z = 100;

function animate() {
  cube.rotation.x -= 0.01;
  sphere.rotation.x -= 0.01;
  renderer.render(scene, camera, rtTexture1);
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();
