const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const fs = require('fs');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // add your cloud_name
	api_key: process.env.CLOUDINARY_KEY, // add your api_key
	api_secret: process.env.CLOUDINARY_SECRET, // add your api_secret
	secure: true,
});

// const uploadCloudinary = async (file) => {
// 	const response = await cloudinary.uploader.upload(file, function (error, result) {
// 		console.log(result, error)
// 		return result;
// 	});
// 	return response;
// }

const getImages = async (path) => {
	const data = await cloudinary.search
		.expression(`folder:${path}/*`)
		.sort_by('public_id', 'desc')
		.max_results(20)
		.execute()
		.then((result) => {
			return result.resources;
		});
	return data;
};

const publicIdIteration = (public_id) => {

	let store = '';
	let data = public_id.split('-')
	for (var i = 0; i < data.length; i++) {
		// store += public_id.charAt(i).replace('-', '/');
		store += data[i] + '/'
	}
	return store;
}

const deleteImage = async (public_id, replace = true) => {
	let publicId = replace ? public_id.replaceAll('-', '/') : public_id
	// 	let publicId=publicIdIteration(public_id);
	const data = cloudinary.uploader.destroy(publicId, function (result) {
		return result;
	});
	return data;
};

const deleteVideo = async (public_id) => {
	let publicId = public_id.replaceAll('-', '/')
	let resource_type = 'video'
	const data = cloudinary.uploader.destroy(publicId, { resource_type }, function (result) {
		return result;
	});
	return data;
};

let streamUpload = (file) => {
	return new Promise((resolve, reject) => {
		let stream = cloudinary.uploader.upload_stream((error, result) => {
			if (result) {
				resolve(result);
			} else {
				reject(error);
			}
		});

		streamifier.createReadStream(file.buffer).pipe(stream);
	});
};

async function uploadCloudinary(file) {
	let result = await streamUpload(file);
	return result;
}

async function uploadToCloudinary(locaFilePath, folderPath) {
	// locaFilePath: path of image which was just
	// uploaded to "uploads" folder

	var mainFolderName = folderPath === null ? 'profiles' : folderPath;
	var fileName = locaFilePath.split('\\')[0];
	// filePathOnCloudinary: path of image we want
	// to set when it is uploaded to cloudinary

	// var filePathOnCloudinary = mainFolderName + '/' + fileName;
	//public_id: filePathOnCloudinary
	return cloudinary.uploader
		.upload(locaFilePath, { folder: mainFolderName, resource_type: "auto" })
		.then(async (result) => {

			// Image has been successfully uploaded on
			// cloudinary So we dont need local image 
			// file anymore
			// Remove file from local uploads folder
			let data = await cloudinaryFilter(result)
			fs.unlinkSync(locaFilePath);

			return {
				message: "Success",
				...data
			};
		})
		.catch((error) => {

			// Remove file from local uploads folder
			fs.unlinkSync(locaFilePath);
			return { message: "Fail" };
		});
}

const uploadVideo = (localFilePath) => {
	// locaFilePath: path of image which was just
	// uploaded to "uploads" folder

	var mainFolderName = 'profiles';
	var fileName = localFilePath.split('\\')[0];
	// filePathOnCloudinary: path of image we want
	// to set when it is uploaded to cloudinary

	var filePathOnCloudinary = mainFolderName + '/' + fileName;

	let data = cloudinary.uploader
		.upload(localFilePath, { resource_type: "video", public_id: filePathOnCloudinary })
		.then(async (result) => {
			// Image has been successfully uploaded on
			// cloudinary So we dont need local image
			// file anymore
			// Remove file from local uploads folder
			fs.unlinkSync(localFilePath);

			return {
				message: 'Success',
				url: result.url,
			};
		})
		.catch((error) => {
			console.log(
				'Error while uploading image to cloudinary' +
				JSON.stringify(error)
			);
			// Remove file from local uploads folder
			fs.unlinkSync(localFilePath);
			return { message: 'Fail' };
		});

	return data;


}

const cloudinaryFilter = async (request_data) => {
	try {
		const { public_id, resource_type, url, original_filename } = request_data
		let result = {
			public_id,
			resource_type,
			url,
			original_filename
		}

		return result;
	} catch (error) {
		console.log("Error occurred in updateCompanyType: ", error);
		throw error;
	}
}

module.exports = {
	uploadCloudinary,
	deleteImage,
	getImages,
	uploadToCloudinary,
	uploadVideo,
	deleteVideo
};
