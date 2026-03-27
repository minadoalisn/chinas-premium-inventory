<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElUpload } from 'element-plus'
import type { UploadProps, UploadUserFile, UploadRawFile } from 'element-plus'
import { ElProgress } from 'element-plus'

const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadUserFile[]>([])
const uploading = ref(false)
const percentage = ref(0)

const props = defineProps<{
  modelValue?: string[]
  multiple?: boolean
  accept?: string
  maxSize?: number
  folder?: 'images' | 'documents' | 'products'
  limit?: number
}>()

const emit = defineEmits(['update:modelValue', 'change'])

// 文件类型验证
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const maxSize = props.maxSize || 5 * 1024 * 1024 // 默认5MB
  if (rawFile.size > maxSize) {
    ElMessage.error(`文件大小不能超过 ${(maxSize / 1024 / 1024).toFixed(0)}MB`)
    return false
  }
  return true
}

// 文件数量验证
const handleExceed: UploadProps['onExceed'] = (files, fileList) => {
  ElMessage.warning(
    `最多只能上传 ${props.limit || 5} 个文件，本次选择了 ${files.length} 个文件，总共选择了 ${files.length + fileList.length} 个文件`
  )
}

// 上传成功
const handleSuccess: UploadProps['onSuccess'] = (
  response: any,
  uploadFile: UploadUserFile,
  uploadFiles
) => {
  const fileInfo = response.data
  fileList.value.push({
    name: fileInfo.fileName,
    url: fileInfo.url,
    fileKey: fileInfo.fileKey,
    status: 'success',
  })
  emit('update:modelValue', fileList.value.map(f => f.url))
  ElMessage.success('上传成功')
}

// 上传失败
const handleError: UploadProps['onError'] = (error: Error, uploadFile, uploadFiles) => {
  ElMessage.error('上传失败：' + error.message)
  fileList.value = []
}

// 删除文件
const handleRemove = (file: UploadUserFile) => {
  const index = fileList.value.indexOf(file)
  if (index > -1) {
    fileList.value.splice(index, 1)
    emit('update:modelValue', fileList.value.map(f => f.url))
  }
}

// 获取图片预览URL
const getImageUrl = (file: UploadUserFile) => {
  return file.url || URL.createObjectURL(file.raw as File)
}

// 清空文件列表
const clearFiles = () => {
  fileList.value = []
  emit('update:modelValue', [])
}
</script>

<template>
  <div class="upload-container">
    <el-upload
      ref="uploadRef"
      v-model:fileList"
      :action="`${import.meta.env.VITE_API_BASE_URL}/upload/image`"
      :list-type="picture-card"
      :auto-upload="false"
      :http-request="handleUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :multiple="multiple"
      :limit="5"
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
    >
      <el-button type="primary" :loading="uploading">
        <el-icon><Upload /></el-icon>
        上传图片
      </el-button>
      <template #tip>
        <div class="upload-tip">
          支持 jpg/png/gif/webp 格式，单张图片不超过5MB，最多上传5张
        </div>
      </template>
    </el-upload>

    <div v-if="fileList.length > 0" class="file-list">
      <div
        v-for="(file, index) in fileList"
        :key="index"
        class="file-item"
      >
        <div class="file-image">
          <el-image
            :src="getImageUrl(file)"
            fit="cover"
            :preview-src="getImageUrl(file)"
            :preview-teleported="true"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="file-info">
          <div class="file-name">{{ file.name }}</div>
          <el-button
            type="danger"
            link
            size="small"
            @click="handleRemove(file)"
          >
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  width: 100%;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}

.file-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.file-item {
  position: relative;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.file-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-image {
  width: 100%;
  height: 150px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-error {
  font-size: 32px;
  color: #ccc;
}

.file-info {
  padding: 12px;
  text-align: center;
}

.file-name {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
