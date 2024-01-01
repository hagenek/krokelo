#!/bin/zsh

# Check if directory is provided
if [ -z "$1" ]
then
 echo "No directory provided. Please provide a directory."
 exit 1
fi

# Directory to search
dir="$1"

# Log the directory
echo "Searching directory: $dir"

# Output file
output_file="combined.txt"

# Find and concatenate files
find "$dir" -type f \( -name "*.tsx" -o -name "*.css" \) -exec cat {} + > "$output_file"

# Log the operation
echo "Files combined successfully. Check the $output_file file."